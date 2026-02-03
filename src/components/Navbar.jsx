import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar(){
  return (
    <header className="nav">
      <div className="logo"><Link to="/">Taşımacılık Rehberi</Link></div>
      <nav>
        <Link to="/campaigns">Kampanyalar</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/auth" className="btn primary">Kayıt Ol / Giriş Yap</Link>
      </nav>
    </header>
  )
}
