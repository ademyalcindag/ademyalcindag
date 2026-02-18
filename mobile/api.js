// API Configuration
import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'
import { Platform } from 'react-native'

function getApiBaseUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL
  }

  const hostUri = Constants.expoConfig?.hostUri
  const host = hostUri ? hostUri.split(':')[0] : null

  if (host) {
    return `http://${host}:3001/api`
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001/api'
  }

  return 'http://localhost:3001/api'
}

const API_BASE_URL = getApiBaseUrl()

async function getAuthHeaders() {
  const token = await AsyncStorage.getItem('token')

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function parseResponse(res) {
  const payload = await res.json()
  if (!res.ok) {
    return {
      success: false,
      error: payload?.error || 'İstek başarısız',
    }
  }

  return payload
}

export const api = {
  async fetchFirms() {
    try {
      const res = await fetch(`${API_BASE_URL}/firms`)
      const payload = await parseResponse(res)
      return payload.success ? (payload.data || []) : []
    } catch (error) {
      console.error('fetchFirms error:', error)
      return []
    }
  },

  async fetchFirm(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/firms/${id}`)
      const payload = await parseResponse(res)
      return payload.success ? (payload.data || null) : null
    } catch (error) {
      console.error('fetchFirm error:', error)
      return null
    }
  },

  async searchFirms(filters) {
    try {
      const queryString = new URLSearchParams(filters).toString()
      const res = await fetch(`${API_BASE_URL}/firms?${queryString}`)
      const payload = await parseResponse(res)
      return payload.success ? (payload.data || []) : []
    } catch (error) {
      console.error('searchFirms error:', error)
      return []
    }
  },

  async register(payload) {
    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      return parseResponse(res)
    } catch (error) {
      console.error('register error:', error)
      return { success: false, error: error.message }
    }
  },

  async login(identifier, password) {
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      })
      return parseResponse(res)
    } catch (error) {
      console.error('login error:', error)
      return { success: false, error: error.message }
    }
  },

  async loginCompany(identifier, taxNumber) {
    try {
      const res = await fetch(`${API_BASE_URL}/login-company`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, taxNumber }),
      })
      return parseResponse(res)
    } catch (error) {
      console.error('loginCompany error:', error)
      return { success: false, error: error.message }
    }
  },

  async sendMessage(payload) {
    try {
      const res = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      return parseResponse(res)
    } catch (error) {
      console.error('sendMessage error:', error)
      return { success: false, error: error.message }
    }
  },

  async fetchMessages(firmId) {
    try {
      const res = await fetch(`${API_BASE_URL}/messages/${firmId}`)
      const payload = await parseResponse(res)
      return payload.success ? (payload.data || []) : []
    } catch (error) {
      console.error('fetchMessages error:', error)
      return []
    }
  },

  async updateFirm(firmId, data) {
    try {
      const res = await fetch(`${API_BASE_URL}/firms/${firmId}/update`, {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify(data),
      })
      return parseResponse(res)
    } catch (error) {
      console.error('updateFirm error:', error)
      return { success: false, error: error.message }
    }
  },

  async fetchPrices(firmId) {
    try {
      const res = await fetch(`${API_BASE_URL}/firms/${firmId}/prices`)
      const payload = await parseResponse(res)
      return payload.success ? (payload.data || []) : []
    } catch (error) {
      console.error('fetchPrices error:', error)
      return []
    }
  },

  async addPrice(firmId, data) {
    try {
      const res = await fetch(`${API_BASE_URL}/firms/${firmId}/prices`, {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify(data),
      })
      return parseResponse(res)
    } catch (error) {
      console.error('addPrice error:', error)
      return { success: false, error: error.message }
    }
  },

  async deletePrice(priceId) {
    try {
      const res = await fetch(`${API_BASE_URL}/prices/${priceId}`, {
        method: 'DELETE',
        headers: await getAuthHeaders(),
      })
      return parseResponse(res)
    } catch (error) {
      console.error('deletePrice error:', error)
      return { success: false, error: error.message }
    }
  },
}
