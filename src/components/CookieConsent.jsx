import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const COOKIE_NAME = 'tr_cookie_prefs'
const STORAGE_KEY = 'cookiePreferences'
const PREF_VERSION = '1.0'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180

const defaultPreferences = {
  required: true,
  analytics: false,
  marketing: false,
  version: PREF_VERSION,
  updatedAt: null
}

function setCookie(name, value, maxAgeSeconds) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`
}

function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(';').shift())
  }
  return null
}

function parsePreferences(rawValue) {
  if (!rawValue) return null
  try {
    const parsed = JSON.parse(rawValue)
    return {
      ...defaultPreferences,
      ...parsed,
      required: true,
      version: PREF_VERSION
    }
  } catch {
    return null
  }
}

function savePreferences(preferences) {
  const payload = {
    ...defaultPreferences,
    ...preferences,
    required: true,
    updatedAt: new Date().toISOString(),
    version: PREF_VERSION
  }
  const serialized = JSON.stringify(payload)
  setCookie(COOKIE_NAME, serialized, COOKIE_MAX_AGE)
  localStorage.setItem(STORAGE_KEY, serialized)
  window.dispatchEvent(new CustomEvent('cookie-preferences-updated', { detail: payload }))
  return payload
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  const preferenceText = useMemo(() => {
    const active = []
    if (analytics) active.push('Analitik')
    if (marketing) active.push('Pazarlama')
    return active.length ? `${active.join(' + ')} çerezleri aktif` : 'Sadece zorunlu çerezler aktif'
  }, [analytics, marketing])

  useEffect(() => {
    const fromCookie = parsePreferences(getCookie(COOKIE_NAME))
    const fromStorage = parsePreferences(localStorage.getItem(STORAGE_KEY))
    const existing = fromCookie || fromStorage

    if (!existing) {
      setVisible(true)
      return
    }

    setAnalytics(Boolean(existing.analytics))
    setMarketing(Boolean(existing.marketing))
    setVisible(false)
  }, [])

  useEffect(() => {
    function openPreferences() {
      setVisible(true)
      setExpanded(true)
    }
    window.addEventListener('open-cookie-preferences', openPreferences)
    return () => window.removeEventListener('open-cookie-preferences', openPreferences)
  }, [])

  function acceptAll() {
    savePreferences({ analytics: true, marketing: true })
    setAnalytics(true)
    setMarketing(true)
    setVisible(false)
    setExpanded(false)
  }

  function rejectOptional() {
    savePreferences({ analytics: false, marketing: false })
    setAnalytics(false)
    setMarketing(false)
    setVisible(false)
    setExpanded(false)
  }

  function saveCustom() {
    savePreferences({ analytics, marketing })
    setVisible(false)
    setExpanded(false)
  }

  if (!visible) return null

  return (
    <section className="cookie-consent" role="dialog" aria-live="polite" aria-label="Çerez tercihleri">
      <div className="cookie-consent-content">
        <h3>Çerez Tercihleri</h3>
        <p>
          Sitede güvenlik ve oturum sürekliliği için zorunlu çerezler kullanıyoruz. Analitik ve pazarlama
          çerezlerini onayına göre aktif ediyoruz.
        </p>
        <p className="cookie-consent-status">Durum: {preferenceText}</p>

        {expanded && (
          <div className="cookie-grid">
            <div className="cookie-item">
              <strong>Zorunlu Çerezler</strong>
              <span>Daima aktif · Giriş, güvenlik ve temel fonksiyonlar.</span>
            </div>
            <label className="cookie-item cookie-toggle" htmlFor="analyticsCookies">
              <div>
                <strong>Analitik Çerezler</strong>
                <span>Hangi sayfaların kullanıldığını anonim ölçer.</span>
              </div>
              <input
                id="analyticsCookies"
                type="checkbox"
                checked={analytics}
                onChange={(event) => setAnalytics(event.target.checked)}
              />
            </label>
            <label className="cookie-item cookie-toggle" htmlFor="marketingCookies">
              <div>
                <strong>Pazarlama Çerezleri</strong>
                <span>Daha ilgili kampanya ve reklam içeriği sunar.</span>
              </div>
              <input
                id="marketingCookies"
                type="checkbox"
                checked={marketing}
                onChange={(event) => setMarketing(event.target.checked)}
              />
            </label>
          </div>
        )}

        <div className="cookie-actions">
          <button type="button" className="btn" onClick={() => setExpanded((current) => !current)}>
            {expanded ? 'Ayarları Gizle' : 'Ayarları Yönet'}
          </button>
          <button type="button" className="btn" onClick={rejectOptional}>Sadece Zorunlu</button>
          {expanded && (
            <button type="button" className="btn" onClick={saveCustom}>Tercihleri Kaydet</button>
          )}
          <button type="button" className="btn primary" onClick={acceptAll}>Tümünü Kabul Et</button>
        </div>

        <p className="cookie-consent-note">
          Detaylar için <Link to="/gizlilik-politikasi">Gizlilik Politikası</Link> sayfasını inceleyebilirsin.
        </p>
      </div>
    </section>
  )
}
