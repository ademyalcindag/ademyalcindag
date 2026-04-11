import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/tasimacilikrehberi.png'

export default function Footer() {
  const [showLogoPreview, setShowLogoPreview] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [])

  function handleLogoClick() {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
    }

    setShowLogoPreview(true)
    timerRef.current = window.setTimeout(() => {
      setShowLogoPreview(false)
    }, 3000)
  }

  const isAuth = localStorage.getItem('userAuth') || localStorage.getItem('companyAuth')

  return (
    <>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <section className="footer-column footer-about">
            <div className="footer-brand-row">
              <img
                src={logo}
                alt="Taşımacılık Rehberi logo"
                className="footer-brand-logo"
                onClick={handleLogoClick}
              />
              <p className="footer-brand">Taşımacılık Rehberi</p>
            </div>
            <p className="footer-text">
              Türkiye genelinde kullanıcıları güvenilir nakliye firmalarıyla buluşturan dijital taşıma platformu.
            </p>
          </section>

          <section className="footer-column">
            <h4>Hızlı Erişim</h4>
            <nav className="footer-links" aria-label="Hızlı erişim">
              <Link to="/">Ana Sayfa</Link>
              <Link to="/campaigns">Kampanyalar</Link>
              {!isAuth && <Link to="/auth">Giriş / Kayıt</Link>}
            </nav>
          </section>

          <section className="footer-column">
            <h4>İletişim</h4>
            <ul className="footer-list" aria-label="İletişim bilgileri">
              <li>📧 destek@tasimacilikrehberi.com</li>
              <li>📞 +90 850 000 00 00</li>
              <li>📍 İstanbul, Türkiye</li>
            </ul>
          </section>

          <section className="footer-column">
            <h4>Yasal</h4>
            <div className="footer-links" aria-label="Yasal bağlantılar">
              <Link to="/kvkk">KVKK</Link>
              <Link to="/terms">Şartlar</Link>
              <Link to="/privacy">Gizlilik</Link>
            </div>
          </section>
        </div>

        <div className="site-footer-bottom">
          <p className="footer-copy">© {new Date().getFullYear()} Taşımacılık Rehberi · Tüm hakları saklıdır.</p>
        </div>
      </footer>

      {showLogoPreview && (
        <div className="logo-preview-overlay" aria-hidden="true">
          <img src={logo} alt="" className="logo-preview-image" />
        </div>
      )}
    </>
  )
}
