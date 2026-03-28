import React, { useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { API } from '../data'

function formatTry(value) {
  return `${Number(value || 0).toLocaleString('tr-TR')} ₺`
}

function detectCardType(cardNumber) {
  const digits = cardNumber.replace(/\D/g, '')

  if (/^4/.test(digits)) return 'Visa'
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(digits)) return 'Mastercard'
  if (/^3[47]/.test(digits)) return 'American Express'
  if (/^(6011|65|64[4-9])/.test(digits)) return 'Discover'
  if (/^9792/.test(digits)) return 'Troy'
  if (digits.length === 0) return '-'
  return 'Diğer'
}

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}

function buildCardPreviewNumber(cardNumber) {
  const digits = cardNumber.replace(/\D/g, '').slice(0, 16)
  const padded = `${digits}${'•'.repeat(Math.max(0, 16 - digits.length))}`
  return padded.replace(/(.{4})(?=.)/g, '$1 ').trim()
}

function randomizeSingleMask(cvv) {
  if (!cvv) return ''
  if (cvv.length === 1) return cvv

  const randomIndex = Math.floor(Math.random() * cvv.length)
  return cvv
    .split('')
    .map((digit, index) => (index === randomIndex ? '*' : digit))
    .join('')
}

function generateStartWindow(moveDate, moveTime) {
  const slots = ['09:00', '11:00', '14:00', '16:00', '18:00']
  const selectedSlot = moveTime || slots[Math.floor(Math.random() * slots.length)]
  const date = moveDate || new Date().toISOString().slice(0, 10)
  return `${date} ${selectedSlot}`
}

export default function PurchasePage() {
  const navigate = useNavigate()
  const { firmId } = useParams()
  const location = useLocation()

  const statePayload = location.state || {}
  const booking = statePayload.booking || {}
  const firm = statePayload.firm || { id: Number(firmId), name: 'Firma', pricePerKm: booking?.pricePerKm || 0 }

  const [cardHolder, setCardHolder] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryMonth, setExpiryMonth] = useState('')
  const [expiryYear, setExpiryYear] = useState('')
  const [cvv, setCvv] = useState('')
  const [cvvMaskedPreview, setCvvMaskedPreview] = useState('')
  const [otp, setOtp] = useState('')
  const [checkoutData, setCheckoutData] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [successSummary, setSuccessSummary] = useState(null)

  const distanceKm = Number(booking?.distanceKm || 0)
  const pricePerKm = Number(booking?.pricePerKm || firm?.pricePerKm || 0)
  const moveDate = booking?.moveDate || new Date().toISOString().slice(0, 10)
  const moveTime = booking?.moveTime || '09:00'
  const amount = booking?.amount || Math.round(distanceKm * pricePerKm)
  const cardType = useMemo(() => detectCardType(cardNumber), [cardNumber])
  const liveCardNumber = useMemo(() => buildCardPreviewNumber(cardNumber), [cardNumber])
  const liveCardHolder = cardHolder || 'AD SOYAD'
  const liveCardExpiry = expiryMonth && expiryYear ? `${expiryMonth}/${expiryYear}` : 'AA/YY'

  const years = useMemo(() => {
    const currentYear = Number(new Date().getFullYear().toString().slice(-2))
    return Array.from({ length: 15 }, (_, idx) => String((currentYear + idx) % 100).padStart(2, '0'))
  }, [])

  const months = useMemo(() => Array.from({ length: 12 }, (_, idx) => String(idx + 1).padStart(2, '0')), [])

  const routeReady = booking?.fromCity && booking?.toCity && distanceKm > 0 && pricePerKm > 0

  if (!routeReady) {
    return (
      <div className="container purchase-page">
        <div className="purchase-card">
          <h2>Satın Al</h2>
          <p>Önce ana sayfadan Nereden / Nereye ve Toplam Mesafe bilgilerini girip firmadan Satın Al seçin.</p>
          <button type="button" className="btn primary" onClick={() => navigate('/')}>Ana Sayfaya Dön</button>
        </div>
      </div>
    )
  }

  async function handleCheckout(e) {
    e.preventDefault()

    if (!cardHolder.trim()) {
      setStatusMessage('Kart üzerindeki ad soyad zorunlu')
      return
    }

    if (cardNumber.replace(/\D/g, '').length < 16) {
      setStatusMessage('Kart numarası 16 haneli olmalı')
      return
    }

    if (!expiryMonth || !expiryYear) {
      setStatusMessage('Son kullanım ay/yıl seçimi zorunlu')
      return
    }

    if (cvv.length !== 3) {
      setStatusMessage('CVV 3 haneli olmalı')
      return
    }

    setSubmitting(true)
    setStatusMessage('')

    const result = await API.checkoutWithCard({
      firmId: firm.id,
      fromCity: booking.fromCity,
      toCity: booking.toCity,
      distanceKm,
      moveDate,
      cardHolder,
      cardNumber,
      expiry: `${expiryMonth}/${expiryYear}`,
      cvv,
    })

    setSubmitting(false)

    if (!result.ok) {
      setStatusMessage(result.error || 'Ödeme başlatılamadı')
      return
    }

    setCheckoutData(result.data)
    setStatusMessage('3D Secure doğrulaması için kodu girin (Demo kod: 123456)')
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

    setStatusMessage('')
    setSuccessSummary({
      message: 'Sipariş alındı',
      startWindow: generateStartWindow(moveDate, moveTime),
      method: 'Kapıdan kapıya karayolu taşımacılığı',
      routeLabel: `${booking.fromCity} → ${booking.toCity}`,
      distanceKm,
      amount,
      firmName: firm.name,
      moveTime,
    })

    setCheckoutData(null)
    setOtp('')
  }

  function handleCardNumberChange(value) {
    setCardNumber(formatCardNumber(value))
  }

  function handleCvvChange(value) {
    const normalized = value.replace(/\D/g, '').slice(0, 3)
    setCvv(normalized)
    setCvvMaskedPreview(randomizeSingleMask(normalized))
  }

  return (
    <div className="container purchase-page">
      <div className="purchase-card">
        <div className="purchase-layout">
          <div>
            <h2>Satın Al</h2>
            <p><strong>Firma:</strong> {firm.name}</p>
            <p><strong>Rota:</strong> {booking.fromCity} → {booking.toCity}</p>
            <p><strong>Taşıma Tarih/Saat:</strong> {moveDate} {moveTime}</p>
            <p><strong>Mesafe:</strong> {distanceKm} km</p>
            <p><strong>Km başı fiyat:</strong> {formatTry(pricePerKm)}</p>
            <p><strong>Toplam:</strong> {formatTry(amount)}</p>

            {!successSummary && (
              <form className="purchase-form" onSubmit={handleCheckout}>
                <label>Kart Üzerindeki Ad Soyad
                  <input
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    placeholder="Ad Soyad"
                    required
                  />
                </label>

                <label>Kart Numarası
                  <input
                    value={cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    required
                  />
                </label>
                <p className="purchase-card-type">Kart Tipi: <strong>{cardType}</strong></p>

                <div className="purchase-inline-fields">
                  <label>Son Kullanım Ay
                    <select value={expiryMonth} onChange={(e) => setExpiryMonth(e.target.value)} required>
                      <option value="">Ay</option>
                      {months.map((month) => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </label>

                  <label>Son Kullanım Yıl
                    <select value={expiryYear} onChange={(e) => setExpiryYear(e.target.value)} required>
                      <option value="">Yıl</option>
                      {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </label>

                  <label>CVV
                    <input
                      value={cvv}
                      onChange={(e) => handleCvvChange(e.target.value)}
                      placeholder="123"
                      required
                    />
                  </label>
                </div>

                <p className="purchase-cvv-preview">CVV önizleme: {cvvMaskedPreview || '-'}</p>

                {!checkoutData && (
                  <button type="submit" className="btn primary" disabled={submitting}>
                    {submitting ? 'İşleniyor...' : 'Ödemeyi Başlat'}
                  </button>
                )}
              </form>
            )}

            {checkoutData && !successSummary && (
              <div className="purchase-otp-box">
                <p>3D Secure doğrulaması için SMS kodunu girin.</p>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6 haneli kod"
                />
                <button
                  type="button"
                  className="btn primary"
                  disabled={submitting || otp.length < 6}
                  onClick={handleVerifyOtp}
                >
                  {submitting ? 'Doğrulanıyor...' : 'Satın Almayı Tamamla'}
                </button>
              </div>
            )}

            {statusMessage && <p className="purchase-status">{statusMessage}</p>}

            {successSummary && (
              <div className="purchase-success-box">
                <h3>{successSummary.message}</h3>
                <p><strong>Firma:</strong> {successSummary.firmName}</p>
                <p><strong>Rota:</strong> {successSummary.routeLabel}</p>
                <p><strong>Tutar:</strong> {formatTry(successSummary.amount)}</p>
                <p><strong>İşlem Başlangıcı:</strong> {successSummary.startWindow}</p>
                <p><strong>Taşıma Şekli:</strong> {successSummary.method}</p>
                <button type="button" className="btn" onClick={() => navigate('/')}>Ana Sayfaya Dön</button>
              </div>
            )}
          </div>

          <aside className="purchase-live-card-panel" aria-label="Kart Simülasyonu">
            <p className="purchase-live-card-title">Kart Simülasyonu</p>
            <div className="purchase-live-card">
              <div className="purchase-live-card-top">
                <span className="chip" />
                <strong>{cardType === '-' ? 'KART' : cardType.toUpperCase()}</strong>
              </div>
              <p className="purchase-live-card-number">{liveCardNumber}</p>
              <div className="purchase-live-card-bottom">
                <div>
                  <small>KART SAHİBİ</small>
                  <span>{liveCardHolder}</span>
                </div>
                <div>
                  <small>SON KULLANIM</small>
                  <span>{liveCardExpiry}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
