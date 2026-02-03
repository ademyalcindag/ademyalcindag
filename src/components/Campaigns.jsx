import React, { useState, useEffect } from 'react'

export default function Campaigns(){
  const [campaigns, setCampaigns] = useState([])
  
  useEffect(() => {
    fetch('/api/campaigns').then(r => r.ok ? r.json() : []).then(setCampaigns).catch(err => console.error(err))
  }, [])
  
  return (
    <div className="container campaigns-page">
      <h2>Tüm Kampanyalar</h2>
      <div className="campaign-list">
        {campaigns.length ? campaigns.map(c => (
          <div key={c.id} className="campaign-card">
            <h4>{c.title}</h4>
            <p>{c.description}</p>
          </div>
        )) : <div>Kampanya yok</div>}
      </div>
    </div>
  )
}
