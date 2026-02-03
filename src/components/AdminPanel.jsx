import React, { useState } from 'react'

export default function AdminPanel(){
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    // Admin şifresi: admin123
    if(password === 'admin123'){
      setAuthenticated(true)
      setPassword('')
      localStorage.setItem('adminAuth', 'true')
    } else {
      alert('Hatalı şifre!')
    }
  }

  // Local storage'dan auth kontrol et
  const isAuth = authenticated || localStorage.getItem('adminAuth') === 'true'

  if(!isAuth){
    return (
      <div className="admin-prompt">
        <h3>Admin Paneline Giriş</h3>
        <form onSubmit={handleLogin}>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Şifreyi girin..." />
          <button type="submit">Giriş Yap</button>
        </form>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{width:'100%'}}>
        <h2>Admin Panel</h2>
        <p>Hoş geldiniz, yönetici!</p>
        <button className="btn primary" onClick={()=>{localStorage.removeItem('adminAuth'); setAuthenticated(false)}}>Çıkış Yap</button>
        <div className="admin-cards" style={{marginTop:'20px'}}>
          <div className="card">Kayıtlı Firmalar: <strong>2</strong></div>
          <div className="card">Kampanyalar: <strong>2</strong></div>
          <div className="card">Mesajlar: <strong>0</strong></div>
        </div>
      </div>
    </div>
  )
}
