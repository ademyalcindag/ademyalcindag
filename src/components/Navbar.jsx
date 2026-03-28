import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/tasimacilikrehberi.png'

export default function Navbar(){
  const [showLogoPreview, setShowLogoPreview] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [])

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
          <Link to="/auth" className="btn primary">Kayıt Ol / Giriş Yap</Link>
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
