import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../data'

export default function Auth(){
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [accountType, setAccountType] = useState(null)
  const [loginType, setLoginType] = useState(null) // user | company
  const [password, setPassword] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [taxNumber, setTaxNumber] = useState('')

  // Eğer zaten giriş yapılmışsa kullanıcıyı yetkisine göre uygun yere yönlendir
  useEffect(() => {
    const user = localStorage.getItem('userAuth')
    const company = localStorage.getItem('companyAuth')
    
    if (user) {
      navigate('/')
    } else if (company) {
      navigate('/company/dashboard')
    }
  }, [navigate])

  async function handleLogin(e){
    e.preventDefault()
    if(!loginType) return alert('Giriş türünü seçin')
    
    if(loginType === 'user'){
      const res = await API.login(identifier, password)
      if(res.ok) {
        alert('Giriş başarılı!')
        localStorage.setItem('userAuth', JSON.stringify(res.user))
        if (res.token) localStorage.setItem('authToken', res.token)
        navigate('/')
      } else alert(res.error || 'Kullanıcı bulunamadı')
    } else {
      // Firma login: email/taxNumber ile doğrula
      const res = await API.loginCompany(identifier, taxNumber)
      if(res.ok) {
        alert('Giriş başarılı!')
        localStorage.setItem('companyAuth', JSON.stringify(res.user))
        if (res.token) localStorage.setItem('authToken', res.token)
        navigate('/company/dashboard')
      } else alert(res.error || 'Firma bulunamadı veya vergi numarası yanlış')
    }
    setIdentifier('')
    setPassword('')
    setTaxNumber('')
  }

  function startRegister(){
    setMode('account-type')
  }

  function selectAccountType(type){
    setAccountType(type)
    setMode('register')
  }

  async function handleRegister(e){
    e.preventDefault()
    const form = new FormData(e.target)
    const obj = Object.fromEntries(form)
    
    if(accountType === 'company'){
      const photos = []
      if(obj.photoFile && obj.photoFile !== ''){
        const fd = new FormData()
        fd.append('file', e.target.photoFile.files[0])
        const up = await API.uploadFile(fd)
        if(up.path) photos.push(up.path)
      }
      obj.type = 'company'
      obj.photos = photos
    } else if(accountType === 'user') {
      obj.type = 'user'
    }
    
    const res = await API.register(obj)
    if(res.ok) {
      if(accountType === 'user'){
        localStorage.setItem('userAuth', JSON.stringify(res.user || res))
        if (res.token) localStorage.setItem('authToken', res.token)
        navigate('/')
      } else if(accountType === 'company'){
        localStorage.setItem('companyAuth', JSON.stringify(res.user || res))
        if (res.token) localStorage.setItem('authToken', res.token)
        navigate('/company/dashboard')
      }
      setMode('login')
      setAccountType(null)
    } else {
      alert(res.error || 'Kayıt sırasında hata oluştu')
    }
  }

  function handleSocialLogin(provider){
    alert(`${provider.toUpperCase()} ile kayıt simülasyonu başlatılıyor...`)
    localStorage.setItem(`socialAuth_${provider}`, JSON.stringify({
      id: Math.random().toString(36),
      name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
      email: `user@${provider}.com`
    }))
    alert('Sosyal hesapla başarıyla bağlandı!')
    localStorage.setItem('userAuth', JSON.stringify({id: Math.random(), name: `${provider} User`}))
    navigate('/')
  }

  return (
    <div className="container auth">
      <div className="auth-box">
        {mode === 'login' && (
          <>
            <div className="tabs">
              <button onClick={()=>{setMode('login'); setLoginType(null)}} className="active">Giriş</button>
              <button onClick={()=>startRegister()}>Kayıt Ol</button>
            </div>

            {!loginType ? (
              <div>
                <h3 style={{marginTop:0, color:'var(--primary)', textAlign:'center'}}>Giriş türünü seçin</h3>
                <div style={{display:'flex', flexDirection:'column', gap:'12px', marginTop:'20px'}}>
                  <button 
                    type="button" 
                    className="btn" 
                    style={{padding:'16px', fontSize:'16px', fontWeight:'600', background:'linear-gradient(135deg, #450ef3, #a9c400)', color:'white', border:'none'}}
                    onClick={() => setLoginType('user')}
                  >
                    👤 Kullanıcı Girişi
                  </button>
                  <button 
                    type="button" 
                    className="btn" 
                    style={{padding:'16px', fontSize:'16px', fontWeight:'600', background:'linear-gradient(135deg, #f3450e, #00cdd9)', color:'white', border:'none'}}
                    onClick={() => setLoginType('company')}
                  >
                    🏢 Firma Girişi
                  </button>
                </div>
              </div>
            ) : (
              <>
                {loginType === 'user' ? (
                  <div>
                    <h3 style={{marginTop:0, color:'var(--primary)'}}>👤 Kullanıcı Girişi</h3>
                    <form className="form" onSubmit={handleLogin}>
                      <label>Telefon veya E-posta<input value={identifier} onChange={e=>setIdentifier(e.target.value)} required /></label>
                      <label>Şifre<input type="password" value={password} onChange={e=>setPassword(e.target.value)}/></label>
                      <button className="btn primary" type="submit">Giriş Yap</button>
                    </form>
                    <div style={{textAlign:'center', marginTop:'16px', color:'#6b7280', fontSize:'14px'}}>Veya sosyal hesapla giriş yapın:</div>
                    <div className="socials">
                      <button type="button" className="btn" style={{background:'#4285F4', color:'white', border:'none'}} onClick={()=>handleSocialLogin('google')}>🔵 Google ile Giriş</button>
                      <button type="button" className="btn" style={{background:'#1877F2', color:'white', border:'none'}} onClick={()=>handleSocialLogin('facebook')}>🔵 Facebook ile Giriş</button>
                    </div>
                    <button type="button" className="btn" style={{marginTop:'12px', width:'100%'}} onClick={()=>setLoginType(null)}>Geri</button>
                  </div>
                ) : (
                  <div>
                    <h3 style={{marginTop:0, color:'var(--primary)'}}>🏢 Firma Girişi</h3>
                    <form className="form" onSubmit={handleLogin}>
                      <label>E-posta veya Firma Adı<input value={identifier} onChange={e=>setIdentifier(e.target.value)} required /></label>
                      <label>Vergi Numarası<input value={taxNumber} onChange={e=>setTaxNumber(e.target.value)} placeholder="12345678901" required /></label>
                      <label>Şifre<input type="password" value={password} onChange={e=>setPassword(e.target.value)}/></label>
                      <button className="btn primary" type="submit">Giriş Yap</button>
                    </form>
                    <button type="button" className="btn" style={{marginTop:'12px', width:'100%'}} onClick={()=>setLoginType(null)}>Geri</button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {mode === 'account-type' && (
          <div>
            <h3 style={{marginTop:0, color:'var(--primary)', textAlign:'center'}}>Ne türü bir hesap oluşturmak istiyorsunuz?</h3>
            <div style={{display:'flex', flexDirection:'column', gap:'12px', marginTop:'20px'}}>
              <button 
                type="button" 
                className="btn" 
                style={{padding:'16px', fontSize:'16px', fontWeight:'600', background:'linear-gradient(135deg, #450ef3, #a9c400)', color:'white', border:'none'}}
                onClick={() => selectAccountType('user')}
              >
                👤 Kişi Hesabı
              </button>
              <button 
                type="button" 
                className="btn" 
                style={{padding:'16px', fontSize:'16px', fontWeight:'600', background:'linear-gradient(135deg, #f3450e, #00cdd9)', color:'white', border:'none'}}
                onClick={() => selectAccountType('company')}
              >
                🏢 Firma Hesabı
              </button>
            </div>
            <button type="button" className="btn" style={{marginTop:'16px', width:'100%'}} onClick={()=>{setMode('login'); setAccountType(null)}}>Geri</button>
          </div>
        )}

        {mode === 'register' && accountType === 'user' && (
          <form className="form" onSubmit={handleRegister}>
            <h3 style={{marginTop:0, color:'var(--primary)'}}>Kişi Hesabı Oluştur</h3>
            <label>Ad Soyad<input name="name" required /></label>
            <label>E-posta<input type="email" name="email" required /></label>
            <label>Telefon<input type="tel" name="phone" /></label>
            <label>Şifre<input type="password" name="password" required /></label>
            <div style={{display:'flex', gap:'8px', marginTop:'16px'}}>
              <button className="btn primary" type="submit" style={{flex:1}}>Kayıt Ol</button>
              <button type="button" className="btn" style={{flex:1}} onClick={()=>{setMode('account-type'); setAccountType(null)}}>Geri</button>
            </div>
            <div style={{textAlign:'center', marginTop:'16px', color:'#6b7280', fontSize:'13px'}}>Veya sosyal hesapla kayıt olun:</div>
            <div className="socials">
              <button type="button" className="btn" style={{background:'#4285F4', color:'white', border:'none', fontSize:'13px'}} onClick={()=>handleSocialLogin('google')}>🔵 Google</button>
              <button type="button" className="btn" style={{background:'#1877F2', color:'white', border:'none', fontSize:'13px'}} onClick={()=>handleSocialLogin('facebook')}>🔵 Facebook</button>
            </div>
          </form>
        )}

        {mode === 'register' && accountType === 'company' && (
          <form className="form" onSubmit={handleRegister}>
            <h3 style={{marginTop:0, color:'var(--primary)'}}>Firma Hesabı Oluştur</h3>
            <label>Firma Adı<input name="name" required /></label>
            <label>E-posta<input type="email" name="email" required /></label>
            <label>Telefon<input type="tel" name="phone" required /></label>
            <label>Vergi Numarası<input name="taxNumber" placeholder="12345678901" required /></label>
            <label>Merkez Şehir<input name="city" required /></label>
            <label>İş Adresi<input name="address" required /></label>
            <label>Fotoğraf<input type="file" name="photoFile" /></label>
            <label>Şifre<input type="password" name="password" required /></label>
            <div style={{display:'flex', gap:'8px', marginTop:'16px'}}>
              <button className="btn primary" type="submit" style={{flex:1}}>Kayıt Ol</button>
              <button type="button" className="btn" style={{flex:1}} onClick={()=>{setMode('account-type'); setAccountType(null)}}>Geri</button>
            </div>
            <div style={{textAlign:'center', marginTop:'16px', color:'#6b7280', fontSize:'13px'}}>Veya sosyal hesapla kayıt olun:</div>
            <div className="socials">
              <button type="button" className="btn" style={{background:'#4285F4', color:'white', border:'none', fontSize:'13px'}} onClick={()=>handleSocialLogin('google')}>🔵 Google</button>
              <button type="button" className="btn" style={{background:'#1877F2', color:'white', border:'none', fontSize:'13px'}} onClick={()=>handleSocialLogin('facebook')}>🔵 Facebook</button>
            </div>
          </form>
        )}

      </div>
    </div>
  )
}
