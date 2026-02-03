import React from 'react'
import { Link } from 'react-router-dom'

export default function CompanyCard({ firm }){
  return (
    <article className="card">
      <div className="card-head">
        <h3>{firm.name}</h3>
        <div className="rating">{firm.rating} ⭐</div>
      </div>
      <p>{firm.city} • {firm.address}</p>
      <p>Fiyat: {firm.price} TL • Mesafe: {firm.distanceKm} km</p>
      <div className="card-actions">
        <Link to={`/company/${firm.id}`} className="btn">Detay</Link>
      </div>
    </article>
  )
}
