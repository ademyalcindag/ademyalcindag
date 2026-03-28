import React, { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, Polyline, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const TURKEY_CENTER = [39.0, 35.0]
const TURKEY_BOUNDS = [
  [35.6, 25.8],
  [42.3, 44.9],
]

function isInsideTurkeyBounds(latlng) {
  if (!latlng) return false

  const [[southLat, westLng], [northLat, eastLng]] = TURKEY_BOUNDS
  return latlng.lat >= southLat && latlng.lat <= northLat && latlng.lng >= westLng && latlng.lng <= eastLng
}

const HEAVY_VEHICLE_PROFILE = {
  maneuverWeight: 2.1,
  turnWeight: 1.8,
  roundaboutWeight: 2.4,
  lowSpeedThreshold: 55,
  lowSpeedWeight: 1.7,
  highSpeedThreshold: 70,
  highSpeedBonusWeight: 0.6,
}

function toRad(value) {
  return (value * Math.PI) / 180
}

function calculateDistanceKm(pointA, pointB) {
  if (!pointA || !pointB) return 0

  const earthRadiusKm = 6371
  const dLat = toRad(pointB.lat - pointA.lat)
  const dLon = toRad(pointB.lng - pointA.lng)
  const lat1 = toRad(pointA.lat)
  const lat2 = toRad(pointB.lat)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return Math.max(1, Math.round(earthRadiusKm * c))
}

async function fetchRouteAlternatives(pointA, pointB) {
  const from = `${pointA.lng},${pointA.lat}`
  const to = `${pointB.lng},${pointB.lat}`
  const routeUrl = `https://router.project-osrm.org/route/v1/driving/${from};${to}?overview=full&geometries=geojson&alternatives=true&steps=true`

  const res = await fetch(routeUrl)
  if (!res.ok) {
    throw new Error('Rota alternatifleri alınamadı')
  }

  const data = await res.json()
  const routes = data?.routes || []
  if (!routes.length) {
    throw new Error('Rota bulunamadı')
  }

  const normalized = routes
    .map((route, index) => {
      const meters = Number(route?.distance || 0)
      const seconds = Number(route?.duration || 0)
      const legs = route?.legs || []
      const stepCount = legs.reduce((count, leg) => count + (leg?.steps?.length || 0), 0)
      const turnCount = legs.reduce(
        (count, leg) => count + (leg?.steps || []).filter((step) => ['turn', 'fork', 'merge'].includes(step?.maneuver?.type)).length,
        0
      )
      const roundaboutCount = legs.reduce(
        (count, leg) => count + (leg?.steps || []).filter((step) => step?.maneuver?.type === 'roundabout').length,
        0
      )
      const avgSpeedKmh = seconds > 0 ? (meters / 1000) / (seconds / 3600) : 0
      const durationMin = Math.max(1, Math.round(seconds / 60))
      const truckScore = buildTruckScore(stepCount, durationMin, avgSpeedKmh, turnCount, roundaboutCount)

      return {
        id: index,
        name: `Alternatif ${index + 1}`,
        distanceKm: Math.max(1, Math.round(meters / 1000)),
        durationMin,
        stepCount,
        turnCount,
        roundaboutCount,
        avgSpeedKmh,
        truckScore,
        truckReason: buildTruckReason(truckScore, turnCount, roundaboutCount, avgSpeedKmh),
        geometry: (route?.geometry?.coordinates || []).map(([lng, lat]) => [lat, lng]),
      }
    })
    .filter((route) => route.geometry.length > 1)

  if (!normalized.length) {
    throw new Error('Rota geometrisi alınamadı')
  }

  const truckSuggestedId = normalized
    .slice()
    .sort((a, b) => {
      if (a.truckScore !== b.truckScore) return b.truckScore - a.truckScore
      if (a.stepCount !== b.stepCount) return a.stepCount - b.stepCount
      return a.durationMin - b.durationMin
    })[0].id

  return normalized.map((route) => ({
    ...route,
    isTruckSuggested: route.id === truckSuggestedId,
  }))
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours <= 0) return `${mins} dk`
  if (mins === 0) return `${hours} sa`
  return `${hours} sa ${mins} dk`
}

function buildTruckScore(stepCount, durationMin, avgSpeedKmh, turnCount, roundaboutCount) {
  const profile = HEAVY_VEHICLE_PROFILE
  const maneuverPenalty = stepCount * profile.maneuverWeight
  const turnPenalty = turnCount * profile.turnWeight
  const roundaboutPenalty = roundaboutCount * profile.roundaboutWeight
  const durationPenalty = durationMin * 0.25
  const lowSpeedPenalty = avgSpeedKmh < profile.lowSpeedThreshold ? (profile.lowSpeedThreshold - avgSpeedKmh) * profile.lowSpeedWeight : 0
  const highSpeedBonus = avgSpeedKmh > profile.highSpeedThreshold
    ? Math.min((avgSpeedKmh - profile.highSpeedThreshold) * profile.highSpeedBonusWeight, 10)
    : 0

  const rawScore = 100 - maneuverPenalty - turnPenalty - roundaboutPenalty - durationPenalty - lowSpeedPenalty + highSpeedBonus
  return Math.max(0, Math.round(rawScore))
}

function buildTruckReason(score, turnCount, roundaboutCount, avgSpeedKmh) {
  if (score >= 70) return 'Daha akıcı ve ağır araç için daha uygun'
  if (roundaboutCount >= 3 || turnCount >= 10) return 'Manevra sayısı yüksek rota'
  if (avgSpeedKmh < 45) return 'Şehir içi yoğunluk olasılığı yüksek'
  return 'Standart rota'
}

function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Tarayıcı konum desteği yok'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      () => reject(new Error('Konum alınamadı')),
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      }
    )
  })
}

async function reverseGeocode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=10&accept-language=tr`
  const res = await fetch(url, {
    headers: {
      'accept-language': 'tr',
    },
  })

  if (!res.ok) {
    throw new Error('Konum çözümlenemedi')
  }

  const data = await res.json()
  const address = data?.address || {}

  return (
    address.city ||
    address.town ||
    address.province ||
    address.state ||
    address.county ||
    ''
  )
}

function MapClickListener({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng)
    },
  })

  return null
}

function MapSizeInvalidator({ refreshKey }) {
  const map = useMap()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      map.invalidateSize()
    }, 80)

    return () => window.clearTimeout(timer)
  }, [map, refreshKey])

  return null
}

function buildCoordKey(point) {
  return `${Number(point.lat).toFixed(4)},${Number(point.lng).toFixed(4)}`
}

export default function RouteMapPicker({
  isOpen,
  onClose,
  onApply,
  initialFromCity,
  initialToCity,
  initialMoveDate,
  initialMoveTime,
}) {
  const [activePoint, setActivePoint] = useState('from')
  const [fromPoint, setFromPoint] = useState(null)
  const [toPoint, setToPoint] = useState(null)
  const [fromCityName, setFromCityName] = useState(initialFromCity || '')
  const [toCityName, setToCityName] = useState(initialToCity || '')
  const [moveDate, setMoveDate] = useState(initialMoveDate || new Date().toISOString().slice(0, 10))
  const [moveTime, setMoveTime] = useState(initialMoveTime || '09:00')
  const [routeDistanceKm, setRouteDistanceKm] = useState(0)
  const [distanceType, setDistanceType] = useState('none')
  const [routes, setRoutes] = useState([])
  const [selectedRouteId, setSelectedRouteId] = useState(0)
  const [loading, setLoading] = useState(false)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState('')
  const reverseGeocodeCacheRef = useRef(new Map())
  const routeAlternativesCacheRef = useRef(new Map())
  const requestSeqRef = useRef(0)

  const stepTitle = useMemo(() => {
    return activePoint === 'from' ? 'Haritada başlangıç noktasını seçin' : 'Haritada bitiş noktasını seçin'
  }, [activePoint])

  async function getCityNameWithCache(latlng) {
    const key = buildCoordKey(latlng)
    const cached = reverseGeocodeCacheRef.current.get(key)
    if (cached) return cached

    const detectedCity = await reverseGeocode(latlng.lat, latlng.lng)
    reverseGeocodeCacheRef.current.set(key, detectedCity)
    return detectedCity
  }

  async function getRouteAlternativesWithCache(from, to) {
    const fromKey = buildCoordKey(from)
    const toKey = buildCoordKey(to)
    const key = `${fromKey}|${toKey}`
    const cached = routeAlternativesCacheRef.current.get(key)
    if (cached) return cached

    const alternatives = await fetchRouteAlternatives(from, to)
    routeAlternativesCacheRef.current.set(key, alternatives)
    return alternatives
  }

  async function resolveAndAssignPoint(target, latlng) {
    const requestId = ++requestSeqRef.current
    setLoading(true)
    setError('')

    try {
      if (!isInsideTurkeyBounds(latlng)) {
        throw new Error('Sadece Türkiye sınırları içinde seçim yapabilirsiniz')
      }

      const detectedCity = await getCityNameWithCache(latlng)
      if (!detectedCity) {
        throw new Error('İl tespit edilemedi, tekrar deneyin')
      }

      if (requestId !== requestSeqRef.current) return

      if (target === 'from') {
        setFromPoint(latlng)
        setFromCityName(detectedCity)
        setActivePoint('to')
      } else {
        setToPoint(latlng)
        setToCityName(detectedCity)
      }

      const nextFromPoint = target === 'from' ? latlng : fromPoint
      const nextToPoint = target === 'to' ? latlng : toPoint

      if (nextFromPoint && nextToPoint) {
        try {
          const routeAlternatives = await getRouteAlternativesWithCache(nextFromPoint, nextToPoint)
          if (requestId !== requestSeqRef.current) return

          setRoutes(routeAlternatives)
          const defaultRoute = routeAlternatives.find((route) => route.isTruckSuggested) || routeAlternatives[0]
          setSelectedRouteId(defaultRoute.id)
          setRouteDistanceKm(defaultRoute.distanceKm)
          setDistanceType('road')
        } catch {
          if (requestId !== requestSeqRef.current) return

          setRoutes([])
          setSelectedRouteId(0)
          setRouteDistanceKm(calculateDistanceKm(nextFromPoint, nextToPoint))
          setDistanceType('air')
        }
      }
    } catch (err) {
      if (requestId !== requestSeqRef.current) return
      setError(err.message || 'Harita seçimi başarısız oldu')
    } finally {
      if (requestId === requestSeqRef.current) {
        setLoading(false)
      }
    }
  }

  function handleMapPick(latlng) {
    resolveAndAssignPoint(activePoint, latlng)
  }

  function handleApply() {
    if (!fromPoint || !toPoint || !fromCityName || !toCityName) {
      setError('Nereden ve nereye için noktaları haritadan seçin')
      return
    }

    const distanceKm = routeDistanceKm || calculateDistanceKm(fromPoint, toPoint)

    onApply({
      fromCity: fromCityName,
      toCity: toCityName,
      distanceKm,
      fromPoint,
      toPoint,
      moveDate,
      moveTime,
    })

    onClose()
  }

  function handleClose() {
    requestSeqRef.current += 1
    setActivePoint('from')
    setFromPoint(null)
    setToPoint(null)
    setRouteDistanceKm(0)
    setDistanceType('none')
    setRoutes([])
    setSelectedRouteId(0)
    setFromCityName(initialFromCity || '')
    setToCityName(initialToCity || '')
    setMoveDate(initialMoveDate || new Date().toISOString().slice(0, 10))
    setMoveTime(initialMoveTime || '09:00')
    setLoading(false)
    setLocating(false)
    setError('')
    onClose()
  }

  function formatPoint(point) {
    if (!point) return '-'
    return `${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`
  }

  async function handleMarkerDrag(target, event) {
    const marker = event.target
    const newPosition = marker.getLatLng()
    await resolveAndAssignPoint(target, newPosition)
  }

  async function useMyLocationAsStart() {
    setLocating(true)
    setError('')

    try {
      const coords = await getCurrentLocation()
      if (!isInsideTurkeyBounds(coords)) {
        throw new Error('Konumunuz Türkiye dışında görünüyor. Lütfen haritadan Türkiye içinde seçim yapın')
      }
      await resolveAndAssignPoint('from', coords)
      setActivePoint('to')
    } catch (err) {
      setError(err.message || 'Konum alınamadı')
    } finally {
      setLocating(false)
    }
  }

  useEffect(() => {
    if (!isOpen) return
    if (fromPoint) return

    useMyLocationAsStart()
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="map-picker-overlay" role="dialog" aria-modal="true" onClick={handleClose}>
      <div className="map-picker-card" onClick={(event) => event.stopPropagation()}>
        <div className="map-picker-header">
          <h4>Harita Üzerinden Seçim</h4>
          <button type="button" className="btn" onClick={handleClose}>Kapat</button>
        </div>

        <p className="map-picker-step">{stepTitle}</p>

        <div className="map-datetime-row">
          <label className="map-date-field">Taşıma Tarihi
            <input
              type="date"
              value={moveDate}
              onChange={(e) => setMoveDate(e.target.value)}
            />
          </label>

          <label className="map-date-field">Taşıma Saati
            <input
              type="time"
              value={moveTime}
              onChange={(e) => setMoveTime(e.target.value)}
              step="900"
            />
          </label>
        </div>

        <div className="map-picker-target-toggle">
          <button
            type="button"
            className="btn"
            onClick={useMyLocationAsStart}
            disabled={locating || loading}
          >
            {locating ? 'Konum alınıyor...' : 'Konumumu Başlangıç Yap'}
          </button>
          <button
            type="button"
            className={`btn ${activePoint === 'from' ? 'primary' : ''}`}
            onClick={() => setActivePoint('from')}
          >
            Başlangıç Noktası
          </button>
          <button
            type="button"
            className={`btn ${activePoint === 'to' ? 'primary' : ''}`}
            onClick={() => setActivePoint('to')}
          >
            Bitiş Noktası
          </button>
        </div>

        <div className="map-picker-preview">
          <span><strong>Nereden:</strong> {fromCityName || '-'} ({formatPoint(fromPoint)})</span>
          <span><strong>Nereye:</strong> {toCityName || '-'} ({formatPoint(toPoint)})</span>
          <span>
            <strong>Mesafe:</strong>{' '}
            {fromPoint && toPoint ? `${routeDistanceKm || calculateDistanceKm(fromPoint, toPoint)} km` : '-'}
            {distanceType === 'road' && ' (yol)'}
            {distanceType === 'air' && ' (yaklaşık)'}
          </span>
        </div>

        <div className="map-picker-map">
          <MapContainer
            center={TURKEY_CENTER}
            zoom={6}
            minZoom={5}
            maxZoom={18}
            maxBounds={TURKEY_BOUNDS}
            maxBoundsViscosity={1.0}
            scrollWheelZoom
            style={{ height: '100%', width: '100%' }}
          >
            <MapSizeInvalidator
              refreshKey={`${isOpen}-${activePoint}-${Boolean(fromPoint)}-${Boolean(toPoint)}-${routes.length}`}
            />
            <TileLayer
              attribution='&copy; OpenStreetMap &copy; CARTO'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {fromPoint && (
              <Marker
                position={fromPoint}
                draggable
                eventHandlers={{
                  dragend: (event) => {
                    handleMarkerDrag('from', event)
                  },
                }}
              />
            )}
            {toPoint && (
              <Marker
                position={toPoint}
                draggable
                eventHandlers={{
                  dragend: (event) => {
                    handleMarkerDrag('to', event)
                  },
                }}
              />
            )}
            {routes.map((route) => (
              <Polyline
                key={route.id}
                positions={route.geometry}
                pathOptions={{
                  color: route.id === selectedRouteId ? '#2563eb' : '#64748b',
                  weight: route.id === selectedRouteId ? 5 : 3,
                  opacity: route.id === selectedRouteId ? 0.95 : 0.5,
                }}
              />
            ))}
            <MapClickListener onPick={handleMapPick} />
          </MapContainer>
        </div>

        {routes.length > 0 && (
          <div className="map-route-list">
            {routes.map((route) => (
              <button
                key={route.id}
                type="button"
                className={`map-route-item ${route.id === selectedRouteId ? 'active' : ''}`}
                onClick={() => {
                  setSelectedRouteId(route.id)
                  setRouteDistanceKm(route.distanceKm)
                  setDistanceType('road')
                }}
              >
                <div className="map-route-row">
                  <strong>{route.name}</strong>
                  {route.isTruckSuggested && <span className="truck-tag">Kamyon İçin Uygun</span>}
                </div>
                <small>{route.distanceKm} km • {formatDuration(route.durationMin)} • {route.stepCount} manevra</small>
                <small className="truck-score-line">Kamyon Puanı: {route.truckScore} • {route.truckReason}</small>
              </button>
            ))}
          </div>
        )}

        {loading && <p className="map-picker-info">Seçim işleniyor...</p>}
        {error && <p className="map-picker-error">{error}</p>}

        <div className="map-picker-actions">
          <button type="button" className="btn" onClick={() => {
            if (activePoint === 'from') {
              setFromPoint(null)
              setFromCityName('')
            } else {
              setToPoint(null)
              setToCityName('')
            }
            setRouteDistanceKm(0)
            setDistanceType('none')
            setRoutes([])
            setSelectedRouteId(0)
          }}>
            Aktif Noktayı Temizle
          </button>
          <button type="button" className="btn primary" onClick={handleApply}>Seçimi Uygula</button>
        </div>
      </div>
    </div>
  )
}
