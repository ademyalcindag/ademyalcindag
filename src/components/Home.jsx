import React, { useState, useEffect, useRef, useCallback } from 'react'
import CompanyCard from './CompanyCard'
import { API } from '../data'

const HERO_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=80',
    alt: 'Taşımacılık kamyon filosu',
    caption: 'Güvenilir filolarla şehirler arası taşıma',
  },
  {
    src: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80',
    alt: 'Yol üzerinde ilerleyen nakliye aracı',
    caption: 'Planlı rota ve zamanında teslimat',
  },
  {
    src: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
    alt: 'Depolama ve yükleme operasyonu',
    caption: 'Kurumsal yükleme ve operasyon yönetimi',
  },
]

const TURKEY_CITIES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya',
  'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bingöl',
  'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli',
  'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep',
  'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İçel', 'İstanbul',
  'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri',
  'Kırıkkale', 'Kırklareli', 'Kırsehir', 'Kilis', 'Kocaeli', 'Konya', 'Kütahya',
  'Lâzistan', 'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu',
  'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Şırnak', 'Tekirdağ',
  'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
]

const DISTRICTS = {
  'Adana': ['Aladağ', 'Ceyhan', 'Feke', 'Karaisalı', 'Karataş', 'Kozan', 'Pozantı', 'Saimbeyli', 'Sarıçam', 'Tufanbeyli', 'Yumurtalık', 'Çukurova'],
  'Ankara': ['Akyurt', 'Altındağ', 'Ankara', 'Ayaş', 'Bala', 'Beypazarı', 'Çamlıdere', 'Çankaya', 'Çubuk', 'Demirlibahçe', 'Eryaman', 'Etimesgut', 'Evren', 'Gölbaşı', 'Güdül', 'Haymana', 'Kahramankazan', 'Kalecik', 'Kızılcahamam', 'Mamak', 'Nallıhan', 'Polatlı', 'Pursaklar', 'Sincan', 'Şereflikoçhisar', 'Yenimahalle'],
  'İstanbul': ['Adalar', 'Avcılar', 'Bağcıköy', 'Bahçelievler', 'Bakırköy', 'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beyoğlu', 'Büyükçekmece', 'Çatalca', 'Çekmeköy', 'Esenler', 'Esenyurt', 'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa', 'Güngören', 'Güzeltepe', 'Halkalı', 'Kağıthane', 'Kartal', 'Kasımpaşa', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sarıyer', 'Şilte', 'Şişli', 'Taksim', 'Tuzla', 'Ümraniye', 'Üsküdar', 'Zeytinburnu'],
  'İzmir': ['Alsancak', 'Balçova', 'Bayındır', 'Bayraklı', 'Bergama', 'Bornova', 'Buca', 'Burmada', 'Çeşme', 'Çiğli', 'Dikili', 'Foça', 'Gaziemir', 'Güzelbahçe', 'İzmir', 'Karaburun', 'Karabörü', 'Karşıyaka', 'Kınık', 'Kiraz', 'Konak', 'Köprübaşı', 'Menderes', 'Menemen', 'Merzifon', 'Narlıdere', 'Ödemiş', 'Pınarbaşı', 'Seferihisar', 'Selçuk', 'Tire', 'Torbalı', 'Urla'],
  'Bursa': ['Altınordu', 'Büyükorhan', 'Cekirge', 'Gemlik', 'Gürsu', 'İnegöl', 'İsmail Beye', 'Keles', 'Kestel', 'Mudanya', 'Mustafakemalpaşa', 'Nilüfer', 'Orhangazi', 'Osmangazi', 'Yenişehir', 'Yıldırım'],
  'Gaziantep': ['Araban', 'Comkayır', 'Gaziantep', 'İslahiye', 'Jarablus', 'Karkamış', 'Nizip', 'Nurdağı', 'Oğuzeli', 'Şahinbey', 'Şehitkamil'],
  'Konya': ['Ahırlı', 'Akören', 'Akşehir', 'Altınekin', 'Beyşehir', 'Bozkır', 'Cihanbeyli', 'Çumra', 'Derbent', 'Doğanhisar', 'Ereğli', 'Hadim', 'Hüyük', 'Karapınar', 'Karchialon', 'Kaymak', 'Konya', 'Kulu', 'Meram', 'Sarayönü', 'Selçuklu', 'Seydişehir', 'Taşkent', 'Tuzlukçu', 'Uluğbey', 'Yalıhüyük', 'Yunak'],
  'Antalya': ['Akseki', 'Aksu', 'Alanya', 'Antalya', 'Atakent', 'Belek', 'Demre', 'Döşemealtı', 'Elmalı', 'Finike', 'Gazipaşa', 'Gündoğmuş', 'İbradı', 'Kalkan', 'Kaş', 'Kemer', 'Kepez', 'Kumluca', 'Lara', 'Manavgat', 'Muratpaşa', 'Ölüdeniz', 'Patara', 'Side'],
  'Diyarbakır': ['Bağlar', 'Bismil', 'Çermik', 'Çinar', 'Çüngüş', 'Diyarbakır', 'Eğil', 'Ergani', 'Hani', 'Hazro', 'Kayapınar', 'Kocaköy', 'Kulp', 'Lice', 'Mardin', 'Silvan', 'Sur', 'Urfaya'],
}

export default function Home(){
  const listRef = useRef(null)
  const [heroImageIndex, setHeroImageIndex] = useState(0)
  const [city, setCity] = useState('')
  const [filteredCities, setFilteredCities] = useState([])
  const [showCities, setShowCities] = useState(false)
  const [district, setDistrict] = useState('')
  const [filteredDistricts, setFilteredDistricts] = useState([])
  const [showDistricts, setShowDistricts] = useState(false)
  const [toCity, setToCity] = useState('')
  const [filteredToCities, setFilteredToCities] = useState([])
  const [showToCities, setShowToCities] = useState(false)
  const [toDistrict, setToDistrict] = useState('')
  const [filteredToDistricts, setFilteredToDistricts] = useState([])
  const [showToDistricts, setShowToDistricts] = useState(false)
  const [moveDate, setMoveDate] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [loadStatus, setLoadStatus] = useState('')
  const [firms, setFirms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchFirms = useCallback(async ({ showLoader = false } = {}) => {
    if (showLoader) {
      setLoading(true)
    }

    try {
      const data = await API.fetchFirms()
      setFirms(data || [])
      setError(null)
    } catch (err) {
      console.error('API error:', err)
      setError('Firmalar yüklenemedi')
      setFirms([])
    } finally {
      if (showLoader) {
        setLoading(false)
      }
    }
  }, [])

  const handleCityInput = (e) => {
    const input = e.target.value
    setCity(input)

    if (input.trim() === '') {
      setFilteredCities([])
      setShowCities(false)
    } else {
      const search = input.toLowerCase().trim()
      const filtered = TURKEY_CITIES
        .filter(c => c.toLowerCase().includes(search))
        .sort((a, b) => {
          const aStarts = a.toLowerCase().startsWith(search) ? 0 : 1
          const bStarts = b.toLowerCase().startsWith(search) ? 0 : 1
          if (aStarts !== bStarts) return aStarts - bStarts
          return a.localeCompare(b, 'tr')
        })
      setFilteredCities(filtered)
      setShowCities(true)
    }
  }

  const selectCity = (selectedCity) => {
    setCity(selectedCity)
    setShowCities(false)
    setFilteredCities([])
  }

  const handleDistrictInput = (e) => {
    const input = e.target.value
    setDistrict(input)

    if (input.trim() === '') {
      setFilteredDistricts([])
      setShowDistricts(false)
    } else {
      const search = input.toLowerCase().trim()
      const cityDistricts = DISTRICTS[city] || []
      const filtered = cityDistricts
        .filter(d => d.toLowerCase().includes(search))
        .sort((a, b) => {
          const aStarts = a.toLowerCase().startsWith(search) ? 0 : 1
          const bStarts = b.toLowerCase().startsWith(search) ? 0 : 1
          if (aStarts !== bStarts) return aStarts - bStarts
          return a.localeCompare(b, 'tr')
        })
      setFilteredDistricts(filtered)
      setShowDistricts(true)
    }
  }

  const selectDistrict = (selectedDistrict) => {
    setDistrict(selectedDistrict)
    setShowDistricts(false)
    setFilteredDistricts([])
  }

  const handleToCityInput = (e) => {
    const input = e.target.value
    setToCity(input)

    if (input.trim() === '') {
      setFilteredToCities([])
      setShowToCities(false)
    } else {
      const search = input.toLowerCase().trim()
      const filtered = TURKEY_CITIES
        .filter(c => c.toLowerCase().includes(search))
        .sort((a, b) => {
          const aStarts = a.toLowerCase().startsWith(search) ? 0 : 1
          const bStarts = b.toLowerCase().startsWith(search) ? 0 : 1
          if (aStarts !== bStarts) return aStarts - bStarts
          return a.localeCompare(b, 'tr')
        })
      setFilteredToCities(filtered)
      setShowToCities(true)
    }
  }

  const selectToCity = (selectedCity) => {
    setToCity(selectedCity)
    setShowToCities(false)
    setFilteredToCities([])
  }

  const handleToDistrictInput = (e) => {
    const input = e.target.value
    setToDistrict(input)

    if (input.trim() === '') {
      setFilteredToDistricts([])
      setShowToDistricts(false)
    } else {
      const search = input.toLowerCase().trim()
      const cityDistricts = DISTRICTS[toCity] || []
      const filtered = cityDistricts
        .filter(d => d.toLowerCase().includes(search))
        .sort((a, b) => {
          const aStarts = a.toLowerCase().startsWith(search) ? 0 : 1
          const bStarts = b.toLowerCase().startsWith(search) ? 0 : 1
          if (aStarts !== bStarts) return aStarts - bStarts
          return a.localeCompare(b, 'tr')
        })
      setFilteredToDistricts(filtered)
      setShowToDistricts(true)
    }
  }

  const selectToDistrict = (selectedDistrict) => {
    setToDistrict(selectedDistrict)
    setShowToDistricts(false)
    setFilteredToDistricts([])
  }

  useEffect(() => {
    fetchFirms({ showLoader: true })
  }, [fetchFirms])

  useEffect(() => {
    const refreshIntervalId = window.setInterval(() => {
      fetchFirms()
    }, 15000)

    const handleWindowFocus = () => {
      fetchFirms()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchFirms()
      }
    }

    window.addEventListener('focus', handleWindowFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.clearInterval(refreshIntervalId)
      window.removeEventListener('focus', handleWindowFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [fetchFirms])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 15000)

    return () => window.clearInterval(intervalId)
  }, [])

  const filtered = firms.filter(f => {
    if (city && f.city.toLowerCase() !== city.toLowerCase()) return false
    if (district && f.district?.toLowerCase() !== district.toLowerCase()) return false
    if (toCity && f.toCity?.toLowerCase() !== toCity.toLowerCase()) return false
    if (toDistrict && f.toDistrict?.toLowerCase() !== toDistrict.toLowerCase()) return false
    if (minPrice && f.price < Number(minPrice)) return false
    if (maxPrice && f.price > Number(maxPrice)) return false
    if (loadStatus && f.loadStatus !== loadStatus) return false
    return true
  })

  const totalFirmCount = firms.length
  const emptyLoadCount = firms.filter(f => f.loadStatus === 'Boş').length
  const avgRating = totalFirmCount
    ? (firms.reduce((sum, firm) => sum + Number(firm.rating || 0), 0) / totalFirmCount).toFixed(1)
    : '0.0'

  const handleSearchScroll = () => {
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="hero-orb orb-one" />
        <div className="hero-orb orb-two" />
        <div className="hero-content">
          <p className="hero-badge">Türkiye Geneli Taşımacılık Ağı</p>
          <h1>Taşıma sürecinizi güvenilir firmalarla, tek noktadan yönetin.</h1>
          <p className="hero-subtitle">
            Taşımacılık Rehberi; kullanıcıları şehir bazlı filtreleme, firma karşılaştırma ve hızlı iletişim adımlarıyla
            doğru hizmet sağlayıcıyla buluşturur.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <strong>{totalFirmCount}</strong>
              <span>Listelenen Firma</span>
            </div>
            <div className="hero-stat">
              <strong>{emptyLoadCount}</strong>
              <span>Boş Kapasiteli Firma</span>
            </div>
            <div className="hero-stat">
              <strong>{avgRating}</strong>
              <span>Ortalama Puan</span>
            </div>
          </div>
        </div>
        <div className="hero-media-card">
          <img
            key={HERO_IMAGES[heroImageIndex].src}
            src={HERO_IMAGES[heroImageIndex].src}
            alt={HERO_IMAGES[heroImageIndex].alt}
          />
          <div className="hero-media-caption">{HERO_IMAGES[heroImageIndex].caption}</div>
          <div className="hero-media-dots" aria-hidden="true">
            {HERO_IMAGES.map((image, index) => (
              <span key={image.src} className={index === heroImageIndex ? 'active' : ''} />
            ))}
          </div>
        </div>
      </section>

      <section className="home-highlights">
        <article className="highlight-card">
          <h3>Akıllı Eşleştirme</h3>
          <p>Şehir, ilçe, fiyat ve yük durumuna göre firmaları saniyeler içinde süzün.</p>
        </article>
        <article className="highlight-card">
          <h3>Şeffaf Karşılaştırma</h3>
          <p>Fiyat, puan ve rota bilgilerini tek ekranda görerek daha hızlı karar verin.</p>
        </article>
        <article className="highlight-card">
          <h3>Hızlı İletişim</h3>
          <p>Firma detayına geçip doğrudan mesaj gönderin, taşıma planınızı hızlandırın.</p>
        </article>
      </section>

      <div className="container home-content">
        <aside className="filters">
          <h3>Filtreler</h3>
          <label>Nereden
            <div className="city-autocomplete">
              <input
                value={city}
                onChange={handleCityInput}
                onFocus={() => city && setShowCities(true)}
                placeholder="Şehir seçin..."
              />
              {showCities && filteredCities.length > 0 && (
                <ul className="city-dropdown">
                  {filteredCities.map((c, idx) => (
                    <li key={idx} onClick={() => selectCity(c)}>
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </label>

          {city && DISTRICTS[city] && (
            <label>İlçe
              <div className="city-autocomplete">
                <input
                  value={district}
                  onChange={handleDistrictInput}
                  onFocus={() => district && setShowDistricts(true)}
                  placeholder="İlçe seçin..."
                />
                {showDistricts && filteredDistricts.length > 0 && (
                  <ul className="city-dropdown">
                    {filteredDistricts.map((d, idx) => (
                      <li key={idx} onClick={() => selectDistrict(d)}>
                        {d}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </label>
          )}

          <label>Nereye
            <div className="city-autocomplete">
              <input
                value={toCity}
                onChange={handleToCityInput}
                onFocus={() => toCity && setShowToCities(true)}
                placeholder="Şehir seçin..."
              />
              {showToCities && filteredToCities.length > 0 && (
                <ul className="city-dropdown">
                  {filteredToCities.map((c, idx) => (
                    <li key={idx} onClick={() => selectToCity(c)}>
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </label>

          {toCity && DISTRICTS[toCity] && (
            <label>İlçe
              <div className="city-autocomplete">
                <input
                  value={toDistrict}
                  onChange={handleToDistrictInput}
                  onFocus={() => toDistrict && setShowToDistricts(true)}
                  placeholder="İlçe seçin..."
                />
                {showToDistricts && filteredToDistricts.length > 0 && (
                  <ul className="city-dropdown">
                    {filteredToDistricts.map((d, idx) => (
                      <li key={idx} onClick={() => selectToDistrict(d)}>
                        {d}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </label>
          )}

          <label>Min Fiyat
            <input
              type="text"
              value={minPrice ? Number(minPrice).toLocaleString('tr-TR') + ' ₺' : ''}
              onChange={e => {
                const cleaned = e.target.value.replace(/\D/g, '')
                setMinPrice(cleaned)
              }}
              placeholder="0 ₺"
            />
          </label>
          <label>Maks Fiyat
            <input
              type="text"
              value={maxPrice ? Number(maxPrice).toLocaleString('tr-TR') + ' ₺' : ''}
              onChange={e => {
                const cleaned = e.target.value.replace(/\D/g, '')
                setMaxPrice(cleaned)
              }}
              placeholder="0 ₺"
            />
          </label>
          <label>Yük Durumu
            <select value={loadStatus} onChange={e => setLoadStatus(e.target.value)}>
              <option value="">Hepsi</option>
              <option>Boş</option>
              <option>Dolu</option>
            </select>
          </label>
          <label>Taşıma Tarihi
            <input
              type="date"
              value={moveDate}
              onChange={e => setMoveDate(e.target.value)}
            />
          </label>
          <button className="search-btn" onClick={handleSearchScroll}>
            Sonuçlara Git
          </button>
        </aside>

        <section className="list home-list" ref={listRef}>
          <div className="list-head">
            <h2>Uygun Firmalar</h2>
            <p>{filtered.length} sonuç gösteriliyor</p>
          </div>
          {loading && <div className="loading">Yükleniyor...</div>}
          {error && <div className="error">{error}</div>}
          {!loading && firms.length === 0 && <div className="empty">Firma bulunamadı</div>}
          <div className="cards">
            {filtered.map(f => (
              <CompanyCard
                key={f.id}
                firm={f}
                bookingParams={{
                  fromCity: city,
                  toCity,
                  moveDate,
                }}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
