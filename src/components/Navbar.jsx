import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/tasimacilikrehberi.png'

export default function Navbar(){
  const [showLogoPreview, setShowLogoPreview] = useState(false)
  const timerRef = useRef(null)

  // Auth durumunu kontrol et
  const [auth, setAuth] = useState({ user: null, company: null })
  const location = useLocation()

  useEffect(() => {
    // Her sayfa değişiminde auth durumunu senkronize et
    const user = JSON.parse(localStorage.getItem('userAuth'))
    const company = JSON.parse(localStorage.getItem('companyAuth'))
    setAuth({ user, company })

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [location])

  function handleLogoClick(event) {
    event.preventDefault()
    event.stopPropagation()

    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
    }

    setShowLogoPreview(true)
    timerRef.current = window.setTimeout(() => {
      setShowLogoPreview(false)
    }, 3000)
  }

  const handleLogout = () => {
    localStorage.removeItem('userAuth')
    localStorage.removeItem('companyAuth')
    localStorage.removeItem('authToken')
    window.location.href = '/' // Sayfayı yenileyerek state'i temizle
  }

  return (
    <>
      <header className="nav">
        <div className="logo">
          <Link to="/" className="brand-link">
            <img
              src={logo}
              alt="Taşımacılık Rehberi logo"
              className="brand-logo"
              onClick={handleLogoClick}
            />
            <span>Taşımacılık Rehberi</span>
          </Link>
        </div>
        <nav aria-label="Ana menü">
          <Link to="/campaigns">Kampanyalar</Link>
          
          {!(auth.user || auth.company) ? (
            <Link to="/auth" className="btn primary">Kayıt Ol / Giriş Yap</Link>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {auth.company ? (
                <Link to="/company/dashboard" className="btn">Panelim</Link>
              ) : (
                <Link to="/account" className="btn">{auth.user.name}</Link>
              )}
              <button onClick={handleLogout} className="btn outline" style={{ padding: '5px 10px', fontSize: '13px' }}>Çıkış</button>
            </div>
          )}
        </nav>
      </header>

      {showLogoPreview && (
        <div className="logo-preview-overlay" aria-hidden="true">
          <img src={logo} alt="" className="logo-preview-image" />
        </div>
      )}
    </>
  )
}
