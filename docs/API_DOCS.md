# Backend API Documentation

## 🚀 Başlangıç

Backend server SQLite veritabanı kullanarak çalışır. Sunucuyu başlatmak için:

```bash
npm install
npm run server
```

Server `http://localhost:4000` adresinde çalışacak.

## 🔐 Test Credentials

### Company (Şirket)
- **Email:** metro@tasima.com
- **Password:** password123
- **Tax Number:** 1234567890

### User (Kullanıcı)
- **Email:** user@example.com
- **Password:** user123

---

## 📚 API Endpoints

### Public Routes (Kimlik gerekli değil)

#### Şirketleri Listele
```
GET /api/firms
```
Tüm taşıyıcı şirketleri listeler.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Metro Taşıma",
    "city": "İstanbul",
    "address": "Kadıköy Mah. 15",
    "phone": "+90 532 000 0000",
    "loadStatus": "Boş",
    "price": 2500,
    "distanceKm": 400,
    "rating": 4.5,
    "description": "En güvenilir taşıma hizmeti",
    "photos": ["/uploads/photo1.jpg"]
  }
]
```

#### Şirket Detaylarını Getir
```
GET /api/firms/:id
```

#### Kampanyaları Listele
```
GET /api/campaigns
```

#### Fiyat Ara
```
POST /api/search-prices
Content-Type: application/json

{
  "fromCity": "İstanbul",
  "toCity": "Ankara"
}
```

#### Şirket Fiyatlarını Getir
```
GET /api/firms/:id/prices
```

---

### Authentication Routes

#### Kullanıcı Kayıt
```
POST /api/register-user
Content-Type: application/json

{
  "name": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
  "phone": "+90 500 123 4567",
  "password": "secure123"
}
```

**Response:**
```json
{
  "ok": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Ahmet Yılmaz",
    "email": "ahmet@example.com",
    "phone": "+90 500 123 4567",
    "type": "user"
  }
}
```

#### Şirket Kayıt
```
POST /api/register-company
Content-Type: application/json

{
  "name": "Yeni Nakliyat",
  "email": "yeni@nakliyat.com",
  "taxNumber": "1111111111",
  "city": "İzmir",
  "address": "Alsancak Mah. 50",
  "phone": "+90 532 222 2222",
  "password": "secure123"
}
```

#### Giriş Yap
```
POST /api/login
Content-Type: application/json

{
  "identifier": "metro@tasima.com",
  "password": "password123"
}
```

#### Şirket Girişi (Vergi Numarası ile)
```
POST /api/login-company
Content-Type: application/json

{
  "identifier": "metro@tasima.com",
  "taxNumber": "1234567890",
  "password": "password123"
}
```

---

### Protected Routes (Token gerekli)

Tüm protected endpoints'inde `Authorization` header gerekli:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Firma Profili Güncelle
```
POST /api/firms/:id/update
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "name": "Metro Taşıma Updated",
  "email": "metro@updated.com",
  "phone": "+90 532 000 0001",
  "city": "İstanbul",
  "address": "Yeni Adres",
  "price": 2600,
  "description": "Güncellenmiş açıklama",
  "loadStatus": "Dolu"
}
```

#### Firma İstatistiklerini Getir
```
GET /api/firms/:id/stats
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "totalBookings": 25,
  "totalReviews": 12,
  "pendingBookings": 3,
  "avgRating": 4.5
}
```

#### Fotoğraf Yükle
```
POST /api/firms/:id/photos
Authorization: Bearer TOKEN
Content-Type: multipart/form-data

[file] (binary file)
```

#### Fiyat Ekle
```
POST /api/firms/:id/prices
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "fromCity": "İstanbul",
  "toCity": "Bursa",
  "price": 1500,
  "estimatedHours": 4
}
```

#### Fiyat Sil
```
DELETE /api/prices/:priceId
Authorization: Bearer TOKEN
```

#### Kampanya Oluştur
```
POST /api/firms/:id/campaigns
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "title": "Yeni Yıl Kampanyası",
  "description": "Yeni yılda %20 indirim",
  "discount": 20,
  "startDate": "2025-01-01",
  "endDate": "2025-01-31"
}
```

#### Kampanya Sil
```
DELETE /api/campaigns/:id
Authorization: Bearer TOKEN
```

---

### Messages & Bookings

#### Mesaj Gönder
```
POST /api/messages
Content-Type: application/json

{
  "fromUser": "user123",
  "toFirm": 1,
  "content": "Merhaba, fiyat hakkında bilgi almak istiyorum"
}
```

#### Şirketin Mesajlarını Getir
```
GET /api/messages/:firmId
```

#### Rezervasyon Oluştur
```
POST /api/bookings
Content-Type: application/json

{
  "firmId": 1,
  "userId": "user123",
  "fromCity": "İstanbul",
  "toCity": "Ankara",
  "moveDate": "2025-12-25",
  "items": "1 yaşlı, 1 çocuk, eşyalar",
  "specialRequests": "Asansör bulunmaktadır",
  "totalPrice": 2500
}
```

#### Rezervasyonları Getir
```
GET /api/bookings/:firmId
Authorization: Bearer TOKEN
```

#### Rezervasyon Durumunu Güncelle
```
POST /api/bookings/:id/status
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "status": "confirmed"
}
```

Status değerleri: `pending`, `confirmed`, `completed`, `cancelled`

#### Yorum Yap
```
POST /api/reviews
Content-Type: application/json

{
  "firmId": 1,
  "userId": "user123",
  "rating": 5,
  "comment": "Çok profesyonel ve hızlı hizmet"
}
```

---

### File Upload

#### Dosya Yükle
```
POST /api/upload
Content-Type: multipart/form-data

[file] (binary file)
```

---

## 📊 Database Tables

### users
- id (PK)
- name
- email (UNIQUE)
- phone (UNIQUE)
- password (hashed)
- type (user/company)
- createdAt
- updatedAt

### firms
- id (PK)
- name
- email (UNIQUE)
- taxNumber (UNIQUE)
- city
- address
- phone
- loadStatus
- price
- distanceKm
- rating
- password (hashed)
- description
- createdAt
- updatedAt

### prices
- id (PK)
- firmId (FK)
- fromCity
- toCity
- price
- estimatedHours
- createdAt

### bookings
- id (PK)
- firmId (FK)
- userId
- fromCity
- toCity
- moveDate
- items
- specialRequests
- status (pending/confirmed/completed/cancelled)
- totalPrice
- createdAt
- updatedAt

### reviews
- id (PK)
- firmId (FK)
- userId
- rating
- comment
- createdAt

### campaigns
- id (PK)
- firmId (FK)
- title
- description
- discount
- startDate
- endDate
- createdAt

### photos
- id (PK)
- firmId (FK)
- path
- uploadedAt

### messages
- id (PK)
- fromUser
- toFirm (FK)
- content
- isRead
- createdAt

---

## 🔒 Security Features

✅ **JWT Authentication** - Token tabanlı kimlik doğrulama
✅ **Password Hashing** - bcryptjs ile şifreler şifrelenir
✅ **CORS** - Cross-Origin Resource Sharing etkin
✅ **Input Validation** - Email ve telefon doğrulaması
✅ **Error Handling** - Kapsamlı hata mesajları

---

## 📝 Frontend Integration

Frontend'den API çağrılarında:

```javascript
const API_BASE = 'http://localhost:4000'

// Login
const res = await fetch(`${API_BASE}/api/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    identifier: 'metro@tasima.com',
    password: 'password123'
  })
})

const { token } = await res.json()

// Protected request
const firmRes = await fetch(`${API_BASE}/api/firms/1/stats`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

---

## 🐛 Troubleshooting

### Server başlamıyor
- Port 4000'in kullanılıp kullanılmadığını kontrol et
- Node.js'nin kurulu olduğunu doğrula
- `npm install` çalıştır

### Database hatası
- `server.db` dosyasını sil ve server'ı yeniden başlat
- Yazma izinlerini kontrol et

### CORS hatası
- CORS etkindir, frontend'i kontrol et
- Origin header'ları doğrula

---

## 📚 Environment Variables

`.env` dosyasında:
```
PORT=4000
JWT_SECRET=your-secret-key-change-in-production
```

---

**Backend v1.0 - 2025 📅**
