import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import validator from 'validator'
import dotenv from 'dotenv'
import { OAuth2Client } from 'google-auth-library'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key'
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '703001786924-b09c4sm9kpsbpj8t9leallsunng4j9h1.apps.googleusercontent.com'
const client = new OAuth2Client(GOOGLE_CLIENT_ID)
const __dirname = path.resolve()
const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

const upload = multer({ dest: uploadDir })
const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(uploadDir))

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token provided' })
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' })
    req.user = user
    next()
  })
}

const validateEmail = (email) => validator.isEmail(email)
const validatePhone = (phone) => /^\+?[\d\s\-()]{10,}$/.test(phone)

let db

async function initDb() {
  db = await open({ 
    filename: path.join(__dirname, 'server.db'), 
    driver: sqlite3.Database 
  })

  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      phone TEXT UNIQUE,
      password TEXT NOT NULL,
      type TEXT DEFAULT 'user',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await db.exec(`
    CREATE TABLE IF NOT EXISTS firms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      taxNumber TEXT UNIQUE NOT NULL,
      city TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      loadStatus TEXT DEFAULT 'Boş',
      price INTEGER,
      distanceKm INTEGER,
      rating REAL DEFAULT 4.0,
      password TEXT NOT NULL,
      description TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await db.exec(`
    CREATE TABLE IF NOT EXISTS prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firmId INTEGER NOT NULL,
      fromCity TEXT NOT NULL,
      toCity TEXT NOT NULL,
      price INTEGER NOT NULL,
      estimatedHours REAL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (firmId) REFERENCES firms(id) ON DELETE CASCADE
    )
  `)

  await db.exec(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firmId INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      discount REAL,
      startDate DATETIME,
      endDate DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (firmId) REFERENCES firms(id) ON DELETE CASCADE
    )
  `)

  await db.exec(`
    CREATE TABLE IF NOT EXISTS photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firmId INTEGER NOT NULL,
      path TEXT NOT NULL,
      uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (firmId) REFERENCES firms(id) ON DELETE CASCADE
    )
  `)

  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fromUser TEXT NOT NULL,
      toFirm INTEGER NOT NULL,
      content TEXT NOT NULL,
      isRead BOOLEAN DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (toFirm) REFERENCES firms(id) ON DELETE CASCADE
    )
  `)

  await db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firmId INTEGER NOT NULL,
      userId TEXT,
      fromCity TEXT NOT NULL,
      toCity TEXT NOT NULL,
      moveDate DATETIME,
      items TEXT,
      specialRequests TEXT,
      status TEXT DEFAULT 'pending',
      totalPrice INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (firmId) REFERENCES firms(id) ON DELETE CASCADE
    )
  `)

  await db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firmId INTEGER NOT NULL,
      userId TEXT,
      rating REAL NOT NULL,
      comment TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (firmId) REFERENCES firms(id) ON DELETE CASCADE
    )
  `)

  // Add picture column to users table if it doesn't exist
  try {
    await db.run('ALTER TABLE users ADD COLUMN picture TEXT')
  } catch (e) {
    // Sütun zaten varsa veya başka hata
    if (!e.message.includes('duplicate column')) {
      console.error('Warning: Could not add picture column:', e.message)
    }
  }

  // Demo verileri temizle
  await db.run("DELETE FROM firms WHERE name IN ('Metro Taşıma', 'Anadolu Nakliyat')")
}

// ===== Public Routes =====

app.get('/api/firms', async (req, res) => {
  try {
    const rows = await db.all('SELECT id, name, city, address, phone, loadStatus, price, distanceKm, rating, description FROM firms')
    for (const r of rows) {
      const photos = await db.all('SELECT path FROM photos WHERE firmId = ?', r.id)
      r.photos = photos.map(p => p.path)
    }
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/firms/:id', async (req, res) => {
  try {
    const f = await db.get('SELECT * FROM firms WHERE id = ?', req.params.id)
    if (!f) return res.status(404).json({ error: 'Şirket bulunamadı' })
    
    const photos = await db.all('SELECT path FROM photos WHERE firmId = ?', req.params.id)
    const campaigns = await db.all('SELECT id, title, description, discount, startDate, endDate FROM campaigns WHERE firmId = ?', req.params.id)
    const reviews = await db.all('SELECT rating, comment, createdAt FROM reviews WHERE firmId = ? ORDER BY createdAt DESC LIMIT 10', req.params.id)
    
    f.photos = photos.map(p => p.path)
    f.campaigns = campaigns
    f.reviews = reviews
    res.json(f)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/campaigns', async (req, res) => {
  try {
    const rows = await db.all('SELECT id, firmId, title, description, discount, startDate, endDate FROM campaigns WHERE endDate > CURRENT_TIMESTAMP')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/firms/:id/prices', async (req, res) => {
  try {
    const prices = await db.all('SELECT id, fromCity, toCity, price, estimatedHours FROM prices WHERE firmId = ? ORDER BY fromCity, toCity', req.params.id)
    res.json(prices || [])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/search-prices', async (req, res) => {
  try {
    const { fromCity, toCity } = req.body
    if (!fromCity || !toCity) return res.status(400).json({ error: 'Şehir bilgisi gerekli' })
    
    const prices = await db.all(
      'SELECT p.*, f.name, f.rating FROM prices p JOIN firms f ON p.firmId = f.id WHERE p.fromCity = ? AND p.toCity = ?',
      fromCity, toCity
    )
    res.json(prices || [])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ===== Authentication =====

app.post('/api/register-user', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body
    if (!name || !password) return res.status(400).json({ error: 'Ad ve şifre zorunlu' })
    
    const hashedPassword = await bcrypt.hash(password, 10)
    const stmt = await db.run(
      'INSERT INTO users (name, email, phone, password, type) VALUES (?, ?, ?, ?, ?)',
      [name, email || null, phone || null, hashedPassword, 'user']
    )
    
    const user = await db.get('SELECT id, name, email, phone, type FROM users WHERE id = ?', stmt.lastID)
    const token = jwt.sign({ userId: user.id, type: 'user' }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ ok: true, token, user })
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      res.status(400).json({ error: 'Email veya telefon zaten kayıtlı' })
    } else {
      res.status(500).json({ error: err.message })
    }
  }
})

app.post('/api/register-company', async (req, res) => {
  try {
    const { name, email, taxNumber, city, address, phone, password } = req.body
    if (!name || !taxNumber || !city || !address || !phone || !password) {
      return res.status(400).json({ error: 'Tüm alanlar zorunlu' })
    }
    
    const hashedPassword = await bcrypt.hash(password, 10)
    const stmt = await db.run(
      'INSERT INTO firms (name, email, taxNumber, city, address, phone, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email || null, taxNumber, city, address, phone, hashedPassword]
    )
    
    const firm = await db.get('SELECT id, name, email, taxNumber, city, address, phone FROM firms WHERE id = ?', stmt.lastID)
    const token = jwt.sign({ firmId: firm.id, type: 'company' }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ ok: true, token, firm })
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      res.status(400).json({ error: 'Email veya vergi numarası zaten kayıtlı' })
    } else {
      res.status(500).json({ error: err.message })
    }
  }
})

app.post('/api/login', async (req, res) => {
  try {
    const { identifier, password } = req.body
    if (!identifier || !password) return res.status(400).json({ error: 'Kimlik ve şifre zorunlu' })

    let user = await db.get('SELECT * FROM users WHERE email = ? OR phone = ?', identifier, identifier)
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user.id, type: 'user' }, JWT_SECRET, { expiresIn: '7d' })
      return res.json({ ok: true, token, user: { id: user.id, name: user.name, email: user.email, type: user.type } })
    }

    let firm = await db.get('SELECT * FROM firms WHERE email = ? OR name = ?', identifier, identifier)
    if (firm && await bcrypt.compare(password, firm.password)) {
      const token = jwt.sign({ firmId: firm.id, type: 'company' }, JWT_SECRET, { expiresIn: '7d' })
      return res.json({ ok: true, token, firm: { id: firm.id, name: firm.name, email: firm.email, type: 'company' } })
    }

    res.status(401).json({ error: 'Kimlik veya şifre yanlış' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/login-company', async (req, res) => {
  try {
    const { identifier, taxNumber, password } = req.body
    if (!identifier || !taxNumber || !password) return res.status(400).json({ error: 'Tüm alanlar zorunlu' })

    const firm = await db.get(
      'SELECT * FROM firms WHERE (name = ? OR email = ?) AND taxNumber = ?',
      identifier, identifier, taxNumber
    )
    if (!firm) return res.status(401).json({ error: 'Şirket bulunamadı' })
    
    if (await bcrypt.compare(password, firm.password)) {
      const token = jwt.sign({ firmId: firm.id, type: 'company' }, JWT_SECRET, { expiresIn: '7d' })
      return res.json({ ok: true, token, firm: { id: firm.id, name: firm.name, email: firm.email } })
    }
    
    res.status(401).json({ error: 'Şifre yanlış' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ===== Google OAuth Login =====

app.post('/api/login-google', async (req, res) => {
  try {
    const { idToken } = req.body
    if (!idToken) return res.status(400).json({ error: 'ID token gerekli' })

    // Google ID token'ı doğrula
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    const { email, name, picture } = payload

    if (!email) {
      return res.status(400).json({ error: 'Email adresine ulaşılamadı' })
    }

    // Mevcut kullanıcıyı kontrol et
    let user = await db.get('SELECT * FROM users WHERE email = ?', email)

    if (user) {
      // Kullanıcı zaten var, giriş yap
      const token = jwt.sign({ userId: user.id, type: 'user' }, JWT_SECRET, { expiresIn: '7d' })
      return res.json({
        ok: true,
        token,
        user: { id: user.id, name: user.name, email: user.email, type: user.type, picture: user.picture },
      })
    }

    // Yeni kullanıcı oluştur - Google ile kayıt
    // Rastgele şifre oluştur (Google hesabı kullanılacağı için güvenlik sorunu yok)
    const randomPassword = await bcrypt.hash(Math.random().toString(36).substring(7), 10)

    const stmt = await db.run(
      'INSERT INTO users (name, email, password, type) VALUES (?, ?, ?, ?)',
      [name || 'Google User', email, randomPassword, 'user']
    )

    const newUser = await db.get('SELECT id, name, email, type FROM users WHERE id = ?', stmt.lastID)
    const token = jwt.sign({ userId: newUser.id, type: 'user' }, JWT_SECRET, { expiresIn: '7d' })

    res.json({
      ok: true,
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, type: newUser.type, picture },
    })
  } catch (error) {
    console.error('❌ Google OAuth Error:', {
      message: error.message,
      code: error.code,
      status: error.status
    })
    
    // Hata mesajlarını user-friendly yap
    let errorMsg = 'Google doğrulama başarısız'
    if (error.message?.includes('origin_mismatch')) {
      errorMsg = 'Uygun olmayan origin. Google Cloud Console\'da domain\'ini kontrol et.'
    } else if (error.message?.includes('invalid_client')) {
      errorMsg = 'Geçersiz Google Client ID. Backend administrator\'e bildir.'
    } else if (error.message?.includes('invalid_token')) {
      errorMsg = 'Geçersiz token. Lütfen tekrar dene.'
    }
    
    res.status(500).json({ 
      error: errorMsg,
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})


// ===== Messages & Bookings =====

app.post('/api/messages', async (req, res) => {
  try {
    const { fromUser, toFirm, content } = req.body
    if (!fromUser || !toFirm || !content) return res.status(400).json({ error: 'Tüm alanlar zorunlu' })
    
    await db.run('INSERT INTO messages (fromUser, toFirm, content) VALUES (?, ?, ?)',
      [fromUser, toFirm, content])
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/messages/:firmId', async (req, res) => {
  try {
    const messages = await db.all('SELECT * FROM messages WHERE toFirm = ? ORDER BY createdAt DESC', req.params.firmId)
    res.json(messages || [])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/bookings', async (req, res) => {
  try {
    const { firmId, userId, fromCity, toCity, moveDate, items, specialRequests, totalPrice } = req.body
    if (!firmId || !fromCity || !toCity) return res.status(400).json({ error: 'Gerekli alanlar eksik' })
    
    const stmt = await db.run(
      'INSERT INTO bookings (firmId, userId, fromCity, toCity, moveDate, items, specialRequests, totalPrice, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [firmId, userId || null, fromCity, toCity, moveDate || null, items || null, specialRequests || null, totalPrice || 0, 'pending']
    )
    const booking = await db.get('SELECT * FROM bookings WHERE id = ?', stmt.lastID)
    res.json({ ok: true, booking })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/bookings/:firmId', authenticateToken, async (req, res) => {
  try {
    const bookings = await db.all('SELECT * FROM bookings WHERE firmId = ? ORDER BY createdAt DESC', req.params.firmId)
    res.json(bookings || [])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/bookings/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Geçersiz durum' })
    }
    await db.run('UPDATE bookings SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?', [status, req.params.id])
    const booking = await db.get('SELECT * FROM bookings WHERE id = ?', req.params.id)
    res.json({ ok: true, booking })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/reviews', async (req, res) => {
  try {
    const { firmId, userId, rating, comment } = req.body
    if (!firmId || !rating) return res.status(400).json({ error: 'Şirket ve puan zorunlu' })
    if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Puan 1-5 arasında olmalı' })
    
    await db.run('INSERT INTO reviews (firmId, userId, rating, comment) VALUES (?, ?, ?, ?)',
      [firmId, userId || null, rating, comment || null])
    
    const avgRating = await db.get('SELECT AVG(rating) as avg FROM reviews WHERE firmId = ?', firmId)
    await db.run('UPDATE firms SET rating = ? WHERE id = ?', [avgRating.avg || 4.0, firmId])
    
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ===== File Upload =====

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Dosya bulunamadı' })
    const p = `/uploads/${req.file.filename}`
    res.json({ ok: true, path: p })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/firms/:id/photos', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Dosya bulunamadı' })
    const photoPath = `/uploads/${req.file.filename}`
    await db.run('INSERT INTO photos (firmId, path) VALUES (?, ?)', [req.params.id, photoPath])
    const photos = await db.all('SELECT path FROM photos WHERE firmId = ?', req.params.id)
    res.json({ ok: true, photos: photos.map(p => p.path) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ===== Company Management =====

app.post('/api/firms/:id/update', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, city, address, taxNumber, price, distanceKm, description, loadStatus } = req.body
    
    await db.run(
      'UPDATE firms SET name = ?, email = ?, phone = ?, city = ?, address = ?, taxNumber = ?, price = ?, distanceKm = ?, description = ?, loadStatus = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [name, email, phone, city, address, taxNumber, price, distanceKm, description, loadStatus, req.params.id]
    )
    const firm = await db.get('SELECT id, name, email, phone, city, address, taxNumber, price, distanceKm, description, loadStatus FROM firms WHERE id = ?', req.params.id)
    res.json({ ok: true, firm })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/firms/:id/stats', authenticateToken, async (req, res) => {
  try {
    const totalBookings = await db.get('SELECT COUNT(*) as count FROM bookings WHERE firmId = ?', req.params.id)
    const totalReviews = await db.get('SELECT COUNT(*) as count FROM reviews WHERE firmId = ?', req.params.id)
    const pendingBookings = await db.get('SELECT COUNT(*) as count FROM bookings WHERE firmId = ? AND status = ?', req.params.id, 'pending')
    const avgRating = await db.get('SELECT AVG(rating) as avg FROM reviews WHERE firmId = ?', req.params.id)
    
    res.json({
      totalBookings: totalBookings.count,
      totalReviews: totalReviews.count,
      pendingBookings: pendingBookings.count,
      avgRating: avgRating.avg || 0
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ===== Prices Management =====

app.post('/api/firms/:id/prices', authenticateToken, async (req, res) => {
  try {
    const { fromCity, toCity, price, estimatedHours } = req.body
    if (!fromCity || !toCity || !price) return res.status(400).json({ error: 'Gerekli alanlar eksik' })
    
    await db.run('INSERT INTO prices (firmId, fromCity, toCity, price, estimatedHours) VALUES (?, ?, ?, ?, ?)',
      [req.params.id, fromCity, toCity, price, estimatedHours || null])
    const prices = await db.all('SELECT id, fromCity, toCity, price, estimatedHours FROM prices WHERE firmId = ?', req.params.id)
    res.json({ ok: true, prices })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/prices/:priceId', authenticateToken, async (req, res) => {
  try {
    await db.run('DELETE FROM prices WHERE id = ?', req.params.priceId)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ===== Campaigns Management =====

app.post('/api/firms/:id/campaigns', authenticateToken, async (req, res) => {
  try {
    const { title, description, discount, startDate, endDate } = req.body
    if (!title) return res.status(400).json({ error: 'Başlık zorunlu' })
    
    await db.run(
      'INSERT INTO campaigns (firmId, title, description, discount, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?)',
      [req.params.id, title, description || null, discount || null, startDate || null, endDate || null]
    )
    const campaigns = await db.all('SELECT id, title, description, discount, startDate, endDate FROM campaigns WHERE firmId = ?', req.params.id)
    res.json({ ok: true, campaigns })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/campaigns/:id', authenticateToken, async (req, res) => {
  try {
    await db.run('DELETE FROM campaigns WHERE id = ?', req.params.id)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ===== Error Handling =====

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

// ===== Startup =====

const PORT = process.env.PORT || 4000
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 Backend server running on http://localhost:${PORT}`)
    console.log('\n📊 Test Credentials:')
    console.log('  Company: metro@tasima.com / password123 (Tax: 1234567890)')
    console.log('  User: user@example.com / user123\n')
  })
}).catch(err => {
  console.error('❌ Failed to start server:', err)
  process.exit(1)
})

export default app
