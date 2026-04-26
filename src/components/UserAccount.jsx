import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../data'

function formatDateTime(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('tr-TR')
}

export default function UserAccount() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '' })
  const [threads, setThreads] = useState([])
  const [activeFirmId, setActiveFirmId] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState(false)

  const activeThread = useMemo(() => threads.find((item) => Number(item.firmId) === Number(activeFirmId)) || null, [threads, activeFirmId])
  const unreadTotal = useMemo(
    () => threads.reduce((sum, item) => sum + Number(item.unreadCount || 0), 0),
    [threads]
  )

  async function loadProfileAndThreads() {
    const [profileResult, threadResult] = await Promise.all([
      API.getMyProfile(),
      API.fetchUserChatThreads(),
    ])

    if (!profileResult.ok) {
      throw new Error(profileResult.error || 'Profil alınamadı')
    }

    setProfile(profileResult.user)
    setForm({
      name: profileResult.user?.name || '',
      phone: profileResult.user?.phone || '',
    })

    if (threadResult.ok) {
      setThreads(threadResult.data)
      if (!activeFirmId && threadResult.data?.length) {
        setActiveFirmId(threadResult.data[0].firmId)
      }
    }
  }

  async function loadMessages(firmId) {
    if (!firmId) return
    const result = await API.fetchUserChatMessages(firmId)
    if (result.ok) {
      setMessages(result.data)
    }
  }

  useEffect(() => {
    const userRaw = localStorage.getItem('userAuth')
    if (!userRaw) {
      navigate('/auth')
      return
    }

    setLoading(true)
    loadProfileAndThreads()
      .catch((error) => {
        alert(error.message || 'Hesap bilgileri alınamadı')
      })
      .finally(() => setLoading(false))
  }, [navigate])

  useEffect(() => {
    loadMessages(activeFirmId)
  }, [activeFirmId])

  useEffect(() => {
    const interval = window.setInterval(async () => {
      const threadResult = await API.fetchUserChatThreads()
      if (threadResult.ok) {
        setThreads(threadResult.data)
      }

      if (activeFirmId) {
        const msgResult = await API.fetchUserChatMessages(activeFirmId)
        if (msgResult.ok) {
          setMessages(msgResult.data)
        }
      }
    }, 10000)

    return () => window.clearInterval(interval)
  }, [activeFirmId])

  async function handleSaveProfile(e) {
    e.preventDefault()
    setSaving(true)

    const result = await API.updateMyProfile({
      name: form.name,
      phone: form.phone,
    })

    setSaving(false)

    if (!result.ok) {
      alert(result.error || 'Profil güncellenemedi')
      return
    }

    setProfile(result.user)
    localStorage.setItem('userAuth', JSON.stringify(result.user))
    alert('Profil bilgileri güncellendi')
  }

  async function handleSendMessage(e) {
    e.preventDefault()
    if (!activeFirmId || !newMessage.trim()) return

    setSending(true)
    const result = await API.sendUserChatMessage(activeFirmId, newMessage.trim())
    setSending(false)

    if (!result.ok) {
      alert(result.error || 'Mesaj gönderilemedi')
      return
    }

    setNewMessage('')
    await loadMessages(activeFirmId)
    const threadResult = await API.fetchUserChatThreads()
    if (threadResult.ok) {
      setThreads(threadResult.data)
    }
  }

  if (loading) {
    return <div className="container"><div className="loading" style={{ width: '100%' }}>Hesap yükleniyor...</div></div>
  }

  return (
    <div className="container account-page">
      <section className="account-card">
        <h2>Hesabım</h2>
        <p className="account-subtitle">Bildirimler: <strong>{unreadTotal}</strong> okunmamış mesaj</p>

        <form className="form" onSubmit={handleSaveProfile}>
          <label>Ad Soyad
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </label>

          <label>E-posta
            <input value={profile?.email || ''} disabled />
          </label>

          <label>Telefon
            <input
              value={form.phone || ''}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="+905xxxxxxxxx"
            />
          </label>

          <button className="btn primary" type="submit" disabled={saving}>
            {saving ? 'Kaydediliyor...' : 'Bilgileri Güncelle'}
          </button>
        </form>
      </section>

      <section className="account-card account-chat-card">
        <div className="account-chat-head">
          <h3>Mesajlaştığım Firmalar</h3>
        </div>

        <div className="account-chat-layout">
          <aside className="chat-thread-list">
            {threads.length === 0 && <p className="empty">Henüz mesajlaşma yok</p>}
            {threads.map((thread) => (
              <button
                key={thread.firmId}
                type="button"
                className={`chat-thread-item ${Number(activeFirmId) === Number(thread.firmId) ? 'active' : ''}`}
                onClick={() => setActiveFirmId(thread.firmId)}
              >
                <strong>{thread.firmName}</strong>
                <span>{thread.lastMessage || '-'}</span>
                <small>{formatDateTime(thread.lastMessageAt)}</small>
                {Number(thread.unreadCount || 0) > 0 && (
                  <em>{thread.unreadCount} yeni</em>
                )}
              </button>
            ))}
          </aside>

          <div className="chat-detail">
            <div className="chat-detail-head">
              <strong>{activeThread?.firmName || 'Bir firma seçin'}</strong>
            </div>

            <div className="chat-messages">
              {messages.length === 0 && <p className="empty">Sohbet bulunamadı</p>}
              {messages.map((message) => (
                <div key={message.id} className={`chat-bubble ${message.senderType === 'user' ? 'mine' : 'theirs'}`}>
                  <p>{message.message}</p>
                  <small>{formatDateTime(message.createdAt)}</small>
                </div>
              ))}
            </div>

            <form className="chat-send-form" onSubmit={handleSendMessage}>
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={activeFirmId ? 'Mesajınızı yazın...' : 'Önce bir firma seçin'}
                disabled={!activeFirmId || sending}
              />
              <button className="btn primary" type="submit" disabled={!activeFirmId || sending || !newMessage.trim()}>
                {sending ? 'Gönderiliyor...' : 'Gönder'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
