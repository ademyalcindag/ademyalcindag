const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

function buildUrl(path) {
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path
}

function getAuthToken() {
  return localStorage.getItem('authToken') || ''
}

function jsonHeaders(includeAuth = false) {
  const token = includeAuth ? getAuthToken() : ''
  return {
    'content-type': 'application/json',
    ...(token ? { authorization: `Bearer ${token}` } : {}),
  }
}

async function parseJsonResponse(res) {
  const payload = await res.json().catch(() => null)
  if (!res.ok || payload?.success === false) {
    return {
      ok: false,
      error: payload?.error || 'İstek başarısız',
      status: res.status,
      raw: payload,
    }
  }

  return {
    ok: true,
    status: res.status,
    raw: payload,
  }
}

export const API = {
  async fetchFirms() {
    const res = await fetch(buildUrl('/api/firms'))
    const parsed = await parseJsonResponse(res)
    if (!parsed.ok) return []
    return parsed.raw?.data || []
  },

  async fetchFirm(id) {
    const res = await fetch(buildUrl(`/api/firms/${id}`))
    const parsed = await parseJsonResponse(res)
    if (!parsed.ok) return null
    return parsed.raw?.data || null
  },

  async register(payload) {
    const isCompany = payload?.type === 'company'
    const endpoint = isCompany ? '/api/register-firm' : '/api/register'
    const baseBody = {
      ...payload,
      confirmPassword: payload?.confirmPassword || payload?.password,
    }

    const body = isCompany
      ? {
          ...baseBody,
          district: baseBody?.district || null,
          toCity: baseBody?.toCity || baseBody?.city,
          toDistrict: baseBody?.toDistrict || null,
          description: baseBody?.description || baseBody?.address || null,
        }
      : baseBody

    delete body.type
    delete body.photos
    delete body.photoFile
    delete body.address

    const res = await fetch(buildUrl(endpoint), {
      method: 'POST',
      headers: jsonHeaders(false),
      body: JSON.stringify(body),
    })
    const parsed = await parseJsonResponse(res)

    return parsed.ok
      ? { ok: true, user: parsed.raw?.user, token: parsed.raw?.token }
      : { ok: false, error: parsed.error }
  },

  async login(identifier, password) {
    const res = await fetch(buildUrl('/api/login'), {
      method: 'POST',
      headers: jsonHeaders(false),
      body: JSON.stringify({ identifier, password }),
    })
    const parsed = await parseJsonResponse(res)

    return parsed.ok
      ? { ok: true, user: parsed.raw?.user, token: parsed.raw?.token }
      : { ok: false, error: parsed.error }
  },

  async loginCompany(identifier, taxNumber) {
    const res = await fetch(buildUrl('/api/login-company'), {
      method: 'POST',
      headers: jsonHeaders(false),
      body: JSON.stringify({ identifier, taxNumber }),
    })
    const parsed = await parseJsonResponse(res)

    return parsed.ok
      ? { ok: true, user: parsed.raw?.user, token: parsed.raw?.token }
      : { ok: false, error: parsed.error }
  },

  async sendMessage(payload) {
    const normalizedPayload = {
      firmId: payload?.firmId || payload?.toFirm,
      senderId: payload?.senderId || null,
      senderName: payload?.senderName || payload?.fromUser || 'Anonim',
      senderEmail: payload?.senderEmail || 'unknown@example.com',
      message: payload?.message || payload?.content,
    }

    const res = await fetch(buildUrl('/api/messages'), {
      method: 'POST',
      headers: jsonHeaders(false),
      body: JSON.stringify(normalizedPayload),
    })
    const parsed = await parseJsonResponse(res)

    return parsed.ok ? { ok: true, data: parsed.raw?.data } : { ok: false, error: parsed.error }
  },

  async fetchMessages(firmId) {
    const res = await fetch(buildUrl(`/api/messages/${firmId}`))
    const parsed = await parseJsonResponse(res)
    if (!parsed.ok) return []

    return (parsed.raw?.data || []).map((item) => ({
      ...item,
      fromUser: item.senderName,
      content: item.message,
    }))
  },

  async uploadFile(formData) {
    const res = await fetch(buildUrl('/api/upload'), { method: 'POST', body: formData })
    const parsed = await parseJsonResponse(res)
    if (!parsed.ok) return { ok: false, error: parsed.error }

    return {
      ok: true,
      ...parsed.raw?.data,
    }
  },

  async uploadFirmPhoto(firmId, formData) {
    const res = await fetch(buildUrl(`/api/firms/${firmId}/photos`), {
      method: 'POST',
      headers: {
        ...(getAuthToken() ? { authorization: `Bearer ${getAuthToken()}` } : {}),
      },
      body: formData,
    })
    const parsed = await parseJsonResponse(res)
    if (!parsed.ok) return { ok: false, error: parsed.error }

    const photos = (parsed.raw?.photos || []).map((item) => item.path || item)
    return { ok: true, photos }
  },

  async updateFirm(firmId, data) {
    const res = await fetch(buildUrl(`/api/firms/${firmId}/update`), {
      method: 'POST',
      headers: jsonHeaders(true),
      body: JSON.stringify(data),
    })
    const parsed = await parseJsonResponse(res)

    return parsed.ok
      ? { ok: true, firm: parsed.raw?.data }
      : { ok: false, error: parsed.error }
  },

  async fetchPrices(firmId) {
    const res = await fetch(buildUrl(`/api/firms/${firmId}/prices`))
    const parsed = await parseJsonResponse(res)
    if (!parsed.ok) return []
    return parsed.raw?.data || []
  },

  async addPrice(firmId, data) {
    const res = await fetch(buildUrl(`/api/firms/${firmId}/prices`), {
      method: 'POST',
      headers: jsonHeaders(true),
      body: JSON.stringify(data),
    })
    const parsed = await parseJsonResponse(res)
    if (!parsed.ok) return { ok: false, error: parsed.error }

    const prices = await this.fetchPrices(firmId)
    return { ok: true, prices }
  },

  async deletePrice(priceId) {
    const res = await fetch(buildUrl(`/api/prices/${priceId}`), {
      method: 'DELETE',
      headers: {
        ...(getAuthToken() ? { authorization: `Bearer ${getAuthToken()}` } : {}),
      },
    })
    const parsed = await parseJsonResponse(res)
    return parsed.ok ? { ok: true } : { ok: false, error: parsed.error }
  },

  async getQuote(payload) {
    const res = await fetch(buildUrl('/api/quotes'), {
      method: 'POST',
      headers: jsonHeaders(false),
      body: JSON.stringify(payload),
    })
    const parsed = await parseJsonResponse(res)
    return parsed.ok ? { ok: true, data: parsed.raw?.data } : { ok: false, error: parsed.error }
  },

  async checkoutWithCard(payload) {
    const res = await fetch(buildUrl('/api/payments/checkout'), {
      method: 'POST',
      headers: jsonHeaders(false),
      body: JSON.stringify(payload),
    })
    const parsed = await parseJsonResponse(res)
    return parsed.ok ? { ok: true, data: parsed.raw?.data } : { ok: false, error: parsed.error }
  },

  async verifyThreeDSecure(payload) {
    const res = await fetch(buildUrl('/api/payments/3d-secure/verify'), {
      method: 'POST',
      headers: jsonHeaders(false),
      body: JSON.stringify(payload),
    })
    const parsed = await parseJsonResponse(res)
    return parsed.ok ? { ok: true, message: parsed.raw?.message } : { ok: false, error: parsed.error }
  },

  async loginWithGoogle(idToken) {
    const res = await fetch(buildUrl('/api/login-google'), {
      method: 'POST',
      headers: jsonHeaders(false),
      body: JSON.stringify({ idToken }),
    })
    const parsed = await parseJsonResponse(res)

    return parsed.ok
      ? { ok: true, user: parsed.raw?.user, token: parsed.raw?.token }
      : { ok: false, error: parsed.error }
  },

  async loginFacebook(profile) {
    return { ok: true, user: profile }
  },

  async loginPhone(phone, name) {
    const pseudoUser = { id: Date.now(), phone, name, isCompany: false }
    return { ok: true, user: pseudoUser }
  },
}
