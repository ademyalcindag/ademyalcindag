import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles.css'

const appBase = import.meta.env.VITE_APP_BASE || '/'
const canonicalHost = (import.meta.env.VITE_CANONICAL_HOST || '').trim()

// Google OAuth penceresinde punycode (xn--) görünmesini engellemek için
// IDN hosttan ASCII canonical hosta tek seferlik yönlendirme yap.
if (
  typeof window !== 'undefined' &&
  canonicalHost &&
  window.location.hostname.startsWith('xn--')
) {
  const url = new URL(window.location.href)
  url.hostname = canonicalHost
  window.location.replace(url.toString())
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={appBase}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
