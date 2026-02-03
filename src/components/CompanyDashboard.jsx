import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../data'

export default function CompanyDashboard(){
  const navigate = useNavigate()
  const [firm, setFirm] = useState(null)
  const [messages, setMessages] = useState([])
  const [prices, setPrices] = useState([])
  const [activeTab, setActiveTab] = useState('messages')
  const [editForm, setEditForm] = useState({})
  const [newPrice, setNewPrice] = useState({fromCity:'', toCity:'', price:'', estimatedHours:''})
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    const auth = localStorage.getItem('companyAuth')
    if(!auth) return navigate('/auth')
    
    const company = JSON.parse(auth)
    loadData(company.id)
  }, [])

  const loadData = (firmId) => {
    API.fetchFirm(firmId).then(data => {
      if(data) {
        setFirm(data)
        setEditForm({name:data.name, email:data.email, phone:data.phone, city:data.city, address:data.address, taxNumber:data.taxNumber, price:data.price, distanceKm:data.distanceKm})
      }
    })
    
    API.fetchMessages(firmId).then(msgs => setMessages(msgs || []))
    API.fetchPrices(firmId).then(p => setPrices(p || []))
  }

  const handleLogout = () => {
    localStorage.removeItem('companyAuth')
    navigate('/auth')
  }

  const handleFirmUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await API.updateFirm(firm.id, editForm)
    if(result.ok) {
      setFirm(result.firm)
      alert('Firma bilgileri güncellendi')
    }
    setLoading(false)
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if(!file) return
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    const result = await API.uploadFirmPhoto(firm.id, formData)
    if(result.ok) {
      setFirm({...firm, photos: result.photos})
      alert('Fotoğraf yüklendi')
    }
    setLoading(false)
  }

  const handleAddPrice = async (e) => {
    e.preventDefault()
    if(!newPrice.fromCity || !newPrice.toCity || !newPrice.price) {
      alert('Lütfen tüm alanları doldurun')
      return
    }
    setLoading(true)
    const result = await API.addPrice(firm.id, newPrice)
    if(result.ok) {
      setPrices(result.prices)
      setNewPrice({fromCity:'', toCity:'', price:'', estimatedHours:''})
      alert('Fiyat eklendi')
    }
    setLoading(false)
  }

  const handleDeletePrice = async (priceId) => {
    if(!window.confirm('Silmek istediğinizden emin misiniz?')) return
    const result = await API.deletePrice(priceId)
    if(result.ok) {
      setPrices(prices.filter(p => p.id !== priceId))
      alert('Fiyat silindi')
    }
  }

  if(!firm) return <div style={{padding:'20px',textAlign:'center'}}>Yükleniyor...</div>

  return (
    <div style={{padding:'20px',maxWidth:'1200px',margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'30px'}}>
        <h1 style={{color:'#450ef3'}}>{firm.name} - Yönetim Paneli</h1>
        <button onClick={handleLogout} style={{padding:'10px 20px',background:'#f3450e',color:'white',border:'none',borderRadius:'5px',cursor:'pointer'}}>
          Çıkış Yap
        </button>
      </div>

      <div style={{display:'flex',gap:'10px',marginBottom:'20px',flexWrap:'wrap'}}>
        {['messages', 'firmInfo', 'photos', 'prices'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{padding:'10px 15px',background:activeTab===tab?'#450ef3':'#ddd',color:activeTab===tab?'white':'black',border:'none',borderRadius:'5px',cursor:'pointer'}}
          >
            {tab === 'messages' && 'Mesajlar'}
            {tab === 'firmInfo' && 'Firma Bilgileri'}
            {tab === 'photos' && 'Fotoğraflar'}
            {tab === 'prices' && 'Fiyat Listesi'}
          </button>
        ))}
      </div>

      {/* MESAJLAR */}
      {activeTab === 'messages' && (
        <div style={{background:'white',padding:'20px',borderRadius:'10px',boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
          <h2 style={{color:'#450ef3'}}>Gelen Mesajlar</h2>
          {messages.length > 0 ? (
            <div>
              {messages.map(msg => (
                <div key={msg.id} style={{padding:'15px',borderBottom:'1px solid #eee',background:'#f9f9f9',marginBottom:'10px',borderRadius:'5px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px'}}>
                    <strong style={{color:'#450ef3'}}>{msg.fromUser}</strong>
                    <small style={{color:'#999'}}>{new Date(msg.createdAt).toLocaleDateString('tr-TR')}</small>
                  </div>
                  <p style={{margin:'0'}}>{msg.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{color:'#999'}}>Henüz mesaj yok</p>
          )}
        </div>
      )}

      {/* FİRMA BİLGİLERİ */}
      {activeTab === 'firmInfo' && (
        <div style={{background:'white',padding:'20px',borderRadius:'10px',boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
          <h2 style={{color:'#450ef3'}}>Firma Bilgileri</h2>
          <form onSubmit={handleFirmUpdate}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'15px',marginBottom:'15px'}}>
              <div>
                <label style={{display:'block',marginBottom:'5px',fontWeight:'bold'}}>Firma Adı</label>
                <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name:e.target.value})} style={{width:'100%',padding:'10px',border:'1px solid #ddd',borderRadius:'5px',boxSizing:'border-box'}} />
              </div>
              <div>
                <label style={{display:'block',marginBottom:'5px',fontWeight:'bold'}}>Email</label>
                <input type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email:e.target.value})} style={{width:'100%',padding:'10px',border:'1px solid #ddd',borderRadius:'5px',boxSizing:'border-box'}} />
              </div>
              <div>
                <label style={{display:'block',marginBottom:'5px',fontWeight:'bold'}}>Telefon</label>
                <input type="tel" value={editForm.phone} onChange={e => setEditForm({...editForm, phone:e.target.value})} style={{width:'100%',padding:'10px',border:'1px solid #ddd',borderRadius:'5px',boxSizing:'border-box'}} />
              </div>
              <div>
                <label style={{display:'block',marginBottom:'5px',fontWeight:'bold'}}>Şehir</label>
                <input type="text" value={editForm.city} onChange={e => setEditForm({...editForm, city:e.target.value})} style={{width:'100%',padding:'10px',border:'1px solid #ddd',borderRadius:'5px',boxSizing:'border-box'}} />
              </div>
              <div style={{gridColumn:'1/3'}}>
                <label style={{display:'block',marginBottom:'5px',fontWeight:'bold'}}>Adres</label>
                <input type="text" value={editForm.address} onChange={e => setEditForm({...editForm, address:e.target.value})} style={{width:'100%',padding:'10px',border:'1px solid #ddd',borderRadius:'5px',boxSizing:'border-box'}} />
              </div>
              <div>
                <label style={{display:'block',marginBottom:'5px',fontWeight:'bold'}}>Vergi Numarası</label>
                <input type="text" value={editForm.taxNumber} onChange={e => setEditForm({...editForm, taxNumber:e.target.value})} style={{width:'100%',padding:'10px',border:'1px solid #ddd',borderRadius:'5px',boxSizing:'border-box'}} />
              </div>
              <div>
                <label style={{display:'block',marginBottom:'5px',fontWeight:'bold'}}>Taşıma Ücreti (TL)</label>
                <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price:e.target.value})} style={{width:'100%',padding:'10px',border:'1px solid #ddd',borderRadius:'5px',boxSizing:'border-box'}} />
              </div>
              <div>
                <label style={{display:'block',marginBottom:'5px',fontWeight:'bold'}}>Mesafe (km)</label>
                <input type="number" value={editForm.distanceKm} onChange={e => setEditForm({...editForm, distanceKm:e.target.value})} style={{width:'100%',padding:'10px',border:'1px solid #ddd',borderRadius:'5px',boxSizing:'border-box'}} />
              </div>
            </div>
            <button type="submit" disabled={loading} style={{padding:'10px 20px',background:'#450ef3',color:'white',border:'none',borderRadius:'5px',cursor:'pointer',opacity:loading?0.7:1}}>
              {loading ? 'Güncelleniyor...' : 'Güncelle'}
            </button>
          </form>
        </div>
      )}

      {/* FOTOĞRAFLAR */}
      {activeTab === 'photos' && (
        <div style={{background:'white',padding:'20px',borderRadius:'10px',boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
          <h2 style={{color:'#450ef3'}}>Fotoğraflar</h2>
          <div style={{marginBottom:'20px'}}>
            <label style={{display:'block',marginBottom:'10px',fontWeight:'bold'}}>Fotoğraf Yükle</label>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={loading} style={{padding:'10px',borderRadius:'5px'}} />
          </div>
          {firm.photos && firm.photos.length > 0 ? (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'15px'}}>
              {firm.photos.map(photo => (
                <div key={photo.id} style={{borderRadius:'5px',overflow:'hidden',boxShadow:'0 2px 4px rgba(0,0,0,0.1)'}}>
                  <img src={photo.path} alt="Firma Fotosu" style={{width:'100%',height:'200px',objectFit:'cover'}} />
                </div>
              ))}
            </div>
          ) : (
            <p style={{color:'#999'}}>Henüz fotoğraf yok</p>
          )}
        </div>
      )}

      {/* FİYAT LİSTESİ */}
      {activeTab === 'prices' && (
        <div style={{background:'white',padding:'20px',borderRadius:'10px',boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
          <h2 style={{color:'#450ef3'}}>Fiyat Listesi</h2>
          
          <form onSubmit={handleAddPrice} style={{marginBottom:'20px',padding:'15px',background:'#f9f9f9',borderRadius:'5px'}}>
            <h3 style={{marginTop:'0'}}>Yeni Fiyat Ekle</h3>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'10px',marginBottom:'10px'}}>
              <input type="text" placeholder="Başlangıç Şehri" value={newPrice.fromCity} onChange={e => setNewPrice({...newPrice, fromCity:e.target.value})} style={{padding:'10px',border:'1px solid #ddd',borderRadius:'5px'}} />
              <input type="text" placeholder="Bitiş Şehri" value={newPrice.toCity} onChange={e => setNewPrice({...newPrice, toCity:e.target.value})} style={{padding:'10px',border:'1px solid #ddd',borderRadius:'5px'}} />
              <input type="number" placeholder="Fiyat (TL)" value={newPrice.price} onChange={e => setNewPrice({...newPrice, price:e.target.value})} style={{padding:'10px',border:'1px solid #ddd',borderRadius:'5px'}} />
              <input type="number" placeholder="Tahmin. Saat" value={newPrice.estimatedHours} onChange={e => setNewPrice({...newPrice, estimatedHours:e.target.value})} style={{padding:'10px',border:'1px solid #ddd',borderRadius:'5px'}} />
            </div>
            <button type="submit" disabled={loading} style={{padding:'10px 20px',background:'#a9c400',color:'white',border:'none',borderRadius:'5px',cursor:'pointer',opacity:loading?0.7:1}}>
              {loading ? 'Ekleniyor...' : 'Ekle'}
            </button>
          </form>

          {prices.length > 0 ? (
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr style={{background:'#f5f5f5',borderBottom:'2px solid #ddd'}}>
                  <th style={{padding:'10px',textAlign:'left'}}>Başlangıç</th>
                  <th style={{padding:'10px',textAlign:'left'}}>Bitiş</th>
                  <th style={{padding:'10px',textAlign:'right'}}>Fiyat</th>
                  <th style={{padding:'10px',textAlign:'right'}}>Saat</th>
                  <th style={{padding:'10px',textAlign:'center'}}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {prices.map(p => (
                  <tr key={p.id} style={{borderBottom:'1px solid #eee'}}>
                    <td style={{padding:'10px'}}>{p.fromCity}</td>
                    <td style={{padding:'10px'}}>{p.toCity}</td>
                    <td style={{padding:'10px',textAlign:'right',fontWeight:'bold'}}>{p.price} TL</td>
                    <td style={{padding:'10px',textAlign:'right'}}>{p.estimatedHours} saat</td>
                    <td style={{padding:'10px',textAlign:'center'}}>
                      <button onClick={() => handleDeletePrice(p.id)} style={{padding:'5px 10px',background:'#f3450e',color:'white',border:'none',borderRadius:'3px',cursor:'pointer',fontSize:'12px'}}>
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{color:'#999'}}>Henüz fiyat listesi yok</p>
          )}
        </div>
      )}
    </div>
  )
}
