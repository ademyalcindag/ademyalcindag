import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { API } from '../data'

function formatTry(value) {
  return `${Number(value || 0).toLocaleString('tr-TR')} ₺`
}

function formatDateLabel(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('tr-TR')
}

export default function CompanyCard({ firm, bookingParams }){
  const [loadingQuote, setLoadingQuote] = useState(false)
  const [quote, setQuote] = useState(null)
  const [checkoutData, setCheckoutData] = useState(null)
  const [otp, setOtp] = useState('')
  const [cardForm, setCardForm] = useState({
    cardHolder: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const bookingReady = useMemo(() => {
    return Boolean(bookingParams?.fromCity && bookingParams?.toCity && bookingParams?.moveDate)
  }, [bookingParams])

  async function handleGetQuote() {
    if (!bookingReady) {
      setStatusMessage('Önce filtrelerden Nereden, Nereye ve Tarih alanlarını seçin.')
      return
    }

    setStatusMessage('')
    setLoadingQuote(true)

    const result = await API.getQuote({
      firmId: firm.id,
      fromCity: bookingParams.fromCity,
      toCity: bookingParams.toCity,
      moveDate: bookingParams.moveDate,
    })

    setLoadingQuote(false)

    if (!result.ok) {
      setQuote(null)
      setStatusMessage(result.error || 'Teklif alınamadı')
      return
    }

    setQuote(result.data)
  }

  async function handleCheckoutSubmit(e) {
    e.preventDefault()

    if (!quote) return

    setSubmitting(true)
    setStatusMessage('')

    const result = await API.checkoutWithCard({
      firmId: firm.id,
      fromCity: bookingParams.fromCity,
      toCity: bookingParams.toCity,
      moveDate: bookingParams.moveDate,
      cardHolder: cardForm.cardHolder,
      cardNumber: cardForm.cardNumber,
      expiry: cardForm.expiry,
      cvv: cardForm.cvv,
    })

    setSubmitting(false)

    if (!result.ok) {
      setStatusMessage(result.error || 'Ödeme başlatılamadı')
      return
    }

    setCheckoutData(result.data)
    setStatusMessage('3D Secure doğrulaması için SMS kodunu girin (Demo kod: 123456)')
  }

  async function handleVerifyOtp() {
    if (!checkoutData?.paymentId) return

    setSubmitting(true)
    const result = await API.verifyThreeDSecure({
      paymentId: checkoutData.paymentId,
      otp,
    })
    setSubmitting(false)

    if (!result.ok) {
      setStatusMessage(result.error || '3D doğrulama başarısız')
      return
    }

    setStatusMessage('Ödeme tamamlandı. Satın alma işleminiz oluşturuldu ✅')
    setCheckoutData(null)
    setQuote(null)
    setOtp('')
    setCardForm({ cardHolder: '', cardNumber: '', expiry: '', cvv: '' })
  }

  return (
    <article className="card">
      <div className="card-head">
        <h3>{firm.name}</h3>
        <div className="rating">{firm.rating} ⭐</div>
      </div>
      <p>{firm.city} • {firm.address}</p>
      <p>Fiyat: {firm.price} TL • Mesafe: {firm.distanceKm} km</p>
      <p>Planlanan Tarih: {formatDateLabel(bookingParams?.moveDate)}</p>
      <div className="card-actions">
        <Link to={`/company/${firm.id}`} className="btn">Detay</Link>
        <button
          type="button"
          className="btn quote-btn"
          onClick={handleGetQuote}
          disabled={!bookingReady || loadingQuote}
          title={!bookingReady ? 'Nereden, Nereye ve Tarih seçin' : ''}
        >
          {loadingQuote ? 'Hesaplanıyor...' : 'Fiyat Al'}
        </button>
      </div>

      {quote && (
        <div className="quote-box">
          <p>
            <strong>{bookingParams.fromCity}</strong> → <strong>{bookingParams.toCity}</strong> rotası için teklif:
          </p>
          <h4>{formatTry(quote.amount)}</h4>

          {!checkoutData && (
            <form className="payment-form" onSubmit={handleCheckoutSubmit}>
              <label>Kart Üzerindeki İsim
                <input
                  value={cardForm.cardHolder}
                  onChange={(e) => setCardForm((prev) => ({ ...prev, cardHolder: e.target.value }))}
                  required
                />
              </label>
              <label>Kart Numarası
                <input
                  value={cardForm.cardNumber}
                  onChange={(e) => setCardForm((prev) => ({ ...prev, cardNumber: e.target.value }))}
                  placeholder="4500 0000 0000 0000"
                  required
                />
              </label>
              <div className="payment-inline-fields">
                <label>SKT
                  <input
                    value={cardForm.expiry}
                    onChange={(e) => setCardForm((prev) => ({ ...prev, expiry: e.target.value }))}
                    placeholder="12/29"
                    required
                  />
                </label>
                <label>CVV
                  <input
                    value={cardForm.cvv}
                    onChange={(e) => setCardForm((prev) => ({ ...prev, cvv: e.target.value }))}
                    placeholder="123"
                    required
                  />
                </label>
              </div>
              <button type="submit" className="btn primary" disabled={submitting}>
                {submitting ? 'İşleniyor...' : 'Kart ile Satın Al'}
              </button>
            </form>
          )}

          {checkoutData && (
            <div className="three-d-box">
              <p>3D Secure doğrulaması için telefonunuza gelen kodu girin.</p>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6 haneli kod"
              />
              <button
                type="button"
                className="btn primary"
                disabled={submitting || otp.length < 6}
                onClick={handleVerifyOtp}
              >
                {submitting ? 'Doğrulanıyor...' : '3D Secure Doğrula'}
              </button>
            </div>
          )}
        </div>
      )}

      {statusMessage && <p className="quote-status">{statusMessage}</p>}
    </article>
  )
}
