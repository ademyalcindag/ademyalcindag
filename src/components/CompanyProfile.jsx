import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { API } from '../data'

export default function CompanyProfile(){
  const { id } = useParams()
  const [firm, setFirm] = useState(null)
  const [messageOpen, setMessageOpen] = useState(false)
  const [messageText, setMessageText] = useState('')

  useEffect(()=>{
    API.fetchFirm(id).then(setFirm)
  },[id])
  if(!firm) return <div className="container">Firma bulunamadı veya yükleniyor...</div>

  return (
    <div className="container profile">
      <h2>{firm.name}</h2>
      <p><strong>Merkez:</strong> {firm.city}</p>
      <p><strong>Adres:</strong> {firm.address}</p>
      <p><strong>Telefon:</strong> {firm.phone}</p>
      <p><strong>Vergi No:</strong> {firm.taxNumber}</p>
      <p><strong>Yük Durumu:</strong> {firm.loadStatus}</p>
      <p><strong>Puan:</strong> {firm.rating}</p>

      <section className="photos">
        <h3>Fotoğraflar</h3>
        <div className="photo-grid">{firm.photos?.length ? firm.photos.map((p,i)=>(<img key={p.id || i} src={p.path || p} alt="foto"/>)) : <div className="placeholder">Fotoğraf yok</div>}</div>
      </section>

      <section className="campaigns">
        <h3>Kampanyalar</h3>
        {firm.campaigns && firm.campaigns.length? firm.campaigns.map(c=>(<div key={c.id} className="campaign">{c.title} — {c.description}</div>)) : <div>Bu firmaya ait kampanya yok.</div>}
      </section>

      <div className="actions">
        <button className="btn primary" onClick={()=>setMessageOpen(true)}>Mesaj At</button>
      </div>

      {messageOpen && (
        <div className="modal">
          <div className="modal-body">
            <h4>{firm.name} — Mesaj Gönder</h4>
            <textarea 
              value={messageText} 
              onChange={(e) => setMessageText(e.target.value)} 
              placeholder="Mesajınızı yazın..."
            ></textarea>
            <div className="modal-actions">
              <button className="btn" onClick={()=>setMessageOpen(false)}>İptal</button>
              <button className="btn primary" onClick={async ()=>{
                const content = messageText
                const auth = JSON.parse(localStorage.getItem('userAuth') || 'null')
                const result = auth?.id
                  ? await API.sendUserChatMessage(firm.id, content)
                  : await API.sendMessage({
                      firmId: firm.id,
                      senderId: auth?.id,
                      senderName: auth?.name || 'Anonim',
                      senderEmail: auth?.email || 'unknown@example.com',
                      message: content,
                    })
                if (!result.ok) {
                  alert(result.error || 'Mesaj gönderilemedi')
                  return
                }
                alert('Mesaj gönderildi')
                setMessageOpen(false)
                setMessageText('')
              }}>Gönder</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
