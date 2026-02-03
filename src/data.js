export const API = {
  async fetchFirms(){
    const res = await fetch('/api/firms')
    return res.ok ? res.json() : []
  },
  async fetchFirm(id){
    const res = await fetch(`/api/firms/${id}`)
    return res.ok ? res.json() : null
  },
  async register(payload){
    const res = await fetch('/api/register',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)})
    return res.json()
  },
  async login(identifier){
    const res = await fetch('/api/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({identifier})})
    return res.json()
  },
  async loginCompany(identifier, taxNumber){
    const res = await fetch('/api/login-company',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({identifier, taxNumber})})
    return res.json()
  },
  async sendMessage(payload){
    const res = await fetch('/api/messages',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)})
    return res.json()
  },
  async fetchMessages(firmId){
    const res = await fetch(`/api/messages/${firmId}`)
    return res.ok ? res.json() : []
  },
  async uploadFile(formData){
    const res = await fetch('/api/upload',{method:'POST',body:formData})
    return res.json()
  },
  async uploadFirmPhoto(firmId, formData){
    const res = await fetch(`/api/firms/${firmId}/photos`,{method:'POST',body:formData})
    return res.json()
  },
  async updateFirm(firmId, data){
    const res = await fetch(`/api/firms/${firmId}/update`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)})
    return res.json()
  },
  async fetchPrices(firmId){
    const res = await fetch(`/api/firms/${firmId}/prices`)
    return res.ok ? res.json() : []
  },
  async addPrice(firmId, data){
    const res = await fetch(`/api/firms/${firmId}/prices`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)})
    return res.json()
  },
  async deletePrice(priceId){
    const res = await fetch(`/api/prices/${priceId}`,{method:'DELETE'})
    return res.json()
  },
  async loginGoogle(profile){
    const res = await fetch('/api/auth/google',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({profile})})
    return res.json()
  },
  async loginFacebook(profile){
    const res = await fetch('/api/auth/facebook',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({profile})})
    return res.json()
  },
  async loginPhone(phone, name){
    const res = await fetch('/api/auth/phone',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({phone, name})})
    return res.json()
  }
}

