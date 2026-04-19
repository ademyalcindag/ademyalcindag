/**
 * Taşımacılık Rehberi - Production Backend
 * JWT Authentication + SQLite Database
 * Kurulum: npm install (tüm dependencies zaten var)
 * Çalıştırma: node server/index.js
 * Port: process.env.PORT (Hostinger uyumlu)
 */

import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import crypto from 'crypto'
import { OAuth2Client } from 'google-auth-library'

dotenv.config()

const __dirname = path.resolve()
const uploadDir = path.join(__dirname, 'uploads')
const distDir = path.join(__dirname, 'dist')
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'server.db')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

const upload = multer({ dest: uploadDir })
const app = express()

// CORS Configuration
let corsOptions = {}

if (process.env.NODE_ENV === 'development') {
  // Development: Tüm origins'e izin ver
  corsOptions = {
    origin: '*',
    credentials: false
  }
} else {
  // Production: Sadece izin verilen origins'e izin ver
  const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  if (allowedOrigins.length === 0) {
    // Eğer CORS_ORIGINS set edilmemişse herkese izin ver (güvensiz, ama production'da uyarı ver)
    console.warn('⚠️  CORS_ORIGINS set edilmedi! Tüm origins\'e izin veriliyor.')
    corsOptions = {
      origin: '*',
      credentials: false
    }
  } else {
    corsOptions = {
      origin(origin, callback) {
        // Origin olmayan (mobile, curl) isteklere izin ver
        if (!origin) {
          callback(null, true)
          return
        }
        
        // Exact match kontrol et
        if (allowedOrigins.includes(origin)) {
          callback(null, true)
          return
        }
        
        // www. ile olmayan var mı kontrol et
        const withoutWWW = origin.replace('://www.', '://')
        if (allowedOrigins.some(o => o.replace('://www.', '://') === withoutWWW)) {
          callback(null, true)
          return
        }

        callback(new Error(`CORS blocked: ${origin}`))
      },
      credentials: true
    }
  }
}

console.log('🔐 CORS Configuration:', process.env.NODE_ENV, corsOptions)
app.use(cors(corsOptions))

app.use(express.json())
app.use('/uploads', express.static(uploadDir))

// Serve static files from dist directory (production build)
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))
}

// Constants
const JWT_SECRET = process.env.JWT_SECRET || 'tasimacilik-rehberi-secret-key-2026'
const JWT_EXPIRES = '7d'
const SALT_ROUNDS = 10
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '703001786924-b09c4sm9kpsbpj8t9leallsunng4j9h1.apps.googleusercontent.com'
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID)
const REGISTER_OTP_EXPIRES_MINUTES = 10
const SMS_PROVIDER = String(process.env.SMS_PROVIDER || 'mock').trim().toLowerCase()
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || ''
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || ''
const TWILIO_FROM_NUMBER = process.env.TWILIO_FROM_NUMBER || ''
const SMS_DEFAULT_COUNTRY_CODE = process.env.SMS_DEFAULT_COUNTRY_CODE || '+90'

let db

async function tableHasColumn(tableName, columnName) {
  const columns = await db.all(`PRAGMA table_info(${tableName})`)
  return columns.some((column) => column.name === columnName)
}

async function ensureColumn(tableName, columnName, definition) {
  const exists = await tableHasColumn(tableName, columnName)
  if (!exists) {
    await db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`)
  }
}

async function runSchemaMigrations() {
  await ensureColumn('users', 'updatedAt', 'DATETIME DEFAULT CURRENT_TIMESTAMP')
  await ensureColumn('users', 'picture', 'TEXT')

  await ensureColumn('firms', 'district', 'TEXT')
  await ensureColumn('firms', 'toCity', 'TEXT')
  await ensureColumn('firms', 'toDistrict', 'TEXT')
  await ensureColumn('firms', 'pricePerKm', 'INTEGER')
  await ensureColumn('firms', 'verified', 'BOOLEAN DEFAULT 0')
  await ensureColumn('firms', 'updatedAt', 'DATETIME DEFAULT CURRENT_TIMESTAMP')

  await ensureColumn('messages', 'firmId', 'INTEGER')
  await ensureColumn('messages', 'senderId', 'INTEGER')
  await ensureColumn('messages', 'senderName', 'TEXT')
  await ensureColumn('messages', 'senderEmail', 'TEXT')
  await ensureColumn('messages', 'message', 'TEXT')
  await ensureColumn('messages', 'read', 'BOOLEAN DEFAULT 0')

  const hasToFirm = await tableHasColumn('messages', 'toFirm')
  if (hasToFirm) {
    await db.exec('UPDATE messages SET firmId = COALESCE(firmId, toFirm)')
  }

  const hasFromUser = await tableHasColumn('messages', 'fromUser')
  if (hasFromUser) {
    await db.exec("UPDATE messages SET senderName = COALESCE(senderName, fromUser)")
  }

  const hasContent = await tableHasColumn('messages', 'content')
  if (hasContent) {
    await db.exec("UPDATE messages SET message = COALESCE(message, content)")
  }

  await db.exec("UPDATE messages SET senderName = COALESCE(senderName, 'Anonim')")
  await db.exec("UPDATE messages SET senderEmail = COALESCE(senderEmail, 'unknown@example.com')")
  await db.exec("UPDATE messages SET message = COALESCE(message, '')")

  await ensureColumn('prices', 'createdAt', 'DATETIME DEFAULT CURRENT_TIMESTAMP')
}

async function initDb(){
  const dbDir = path.dirname(DB_PATH)
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true })

  db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  })

  await db.exec('PRAGMA foreign_keys = ON')
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS firms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      taxNumber TEXT UNIQUE NOT NULL,
      city TEXT NOT NULL,
      district TEXT,
      toCity TEXT,
      toDistrict TEXT,
      description TEXT,
      loadStatus TEXT DEFAULT 'Boş',
      price INTEGER,
      pricePerKm INTEGER,
      rating REAL DEFAULT 0,
      password TEXT NOT NULL,
      verified BOOLEAN DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firmId INTEGER NOT NULL,
      senderId INTEGER,
      senderName TEXT NOT NULL,
      senderEmail TEXT NOT NULL,
      message TEXT NOT NULL,
      read BOOLEAN DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(firmId) REFERENCES firms(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firmId INTEGER NOT NULL,
      fromCity TEXT NOT NULL,
      toCity TEXT NOT NULL,
      price INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(firmId) REFERENCES firms(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firmId INTEGER,
      path TEXT NOT NULL,
      uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(firmId) REFERENCES firms(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS booking_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firmId INTEGER NOT NULL,
      fromCity TEXT NOT NULL,
      toCity TEXT NOT NULL,
      moveDate TEXT NOT NULL,
      amount INTEGER NOT NULL,
      currency TEXT DEFAULT 'TRY',
      status TEXT DEFAULT 'pending_3d',
      cardHolder TEXT,
      maskedCard TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(firmId) REFERENCES firms(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS payment_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bookingId INTEGER NOT NULL,
      status TEXT DEFAULT 'pending_3d',
      threeDSCode TEXT,
      threeDSVerifiedAt DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(bookingId) REFERENCES booking_orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS pending_registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT UNIQUE NOT NULL,
      accountType TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      payload TEXT NOT NULL,
      smsCode TEXT,
      smsSentAt DATETIME,
      expiresAt DATETIME NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

  `)

  await runSchemaMigrations()

  await db.exec('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)')
  await db.exec('CREATE INDEX IF NOT EXISTS idx_firms_email ON firms(email)')

  if (await tableHasColumn('messages', 'firmId')) {
    await db.exec('CREATE INDEX IF NOT EXISTS idx_messages_firmId ON messages(firmId)')
  }

  if (await tableHasColumn('prices', 'firmId')) {
    await db.exec('CREATE INDEX IF NOT EXISTS idx_prices_firmId ON prices(firmId)')
  }

  // Demo hesapları temizle
  await db.run("DELETE FROM firms WHERE name IN ('Metro Taşıma', 'Anadolu Nakliyat')")
  
  console.log('✅ Database initialized')
}

// Helper Functions
function generateToken(data) {
  return jwt.sign(data, JWT_SECRET, { expiresIn: JWT_EXPIRES })
}

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS)
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash)
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function createOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function createPendingToken() {
  return crypto.randomUUID()
}

function expiresAtIso(minutes) {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString()
}

function isExpired(isoDate) {
  return !isoDate || Number.isNaN(Date.parse(isoDate)) || Date.parse(isoDate) < Date.now()
}

function normalizePhoneForSms(rawPhone) {
  const cleaned = String(rawPhone || '').replace(/\s+/g, '')
  if (!cleaned) return ''

  if (cleaned.startsWith('+')) return cleaned
  if (cleaned.startsWith('00')) return `+${cleaned.slice(2)}`

  const digits = cleaned.replace(/\D/g, '')
  if (!digits) return ''

  if (digits.startsWith('90')) return `+${digits}`
  if (digits.startsWith('0')) return `${SMS_DEFAULT_COUNTRY_CODE}${digits.slice(1)}`
  return `${SMS_DEFAULT_COUNTRY_CODE}${digits}`
}

function isValidTurkeyPhone(phone) {
  const value = String(phone || '').trim()
  if (!value) return false

  if (/^\+90\d{10}$/.test(value)) return true
  if (/^0\d{10}$/.test(value)) return true
  return false
}

async function sendVerificationSms(phone, code) {
  const normalizedPhone = normalizePhoneForSms(phone)
  if (!normalizedPhone) {
    throw new Error('Telefon numarası doğrulama için uygun formatta değil')
  }

  const message = `Tasima Rehberi dogrulama kodunuz: ${code}`

  if (SMS_PROVIDER === 'mock') {
    console.log(`📩 [MOCK SMS] ${normalizedPhone}: ${message}`)
    return { provider: 'mock', delivered: true }
  }

  if (SMS_PROVIDER === 'twilio') {
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
      throw new Error('Twilio ayarlari eksik. TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN ve TWILIO_FROM_NUMBER gerekli')
    }

    const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`
    const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')
    const body = new URLSearchParams({
      To: normalizedPhone,
      From: TWILIO_FROM_NUMBER,
      Body: message,
    })

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        authorization: `Basic ${auth}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
      body,
    })

    const json = await response.json().catch(() => null)
    if (!response.ok) {
      const detail = json?.message || json?.error_message || 'SMS gonderilemedi'
      throw new Error(`Twilio SMS hatasi: ${detail}`)
    }

    return { provider: 'twilio', delivered: true, sid: json?.sid }
  }

  throw new Error(`Desteklenmeyen SMS provider: ${SMS_PROVIDER}`)
}

async function completePendingUserRegistration(pending, verificationMethod) {
  const payload = JSON.parse(pending.payload)
  const email = normalizeEmail(payload.email)

  const existing = await db.get('SELECT id FROM users WHERE email = ?', [email])
  if (existing) {
    await db.run('DELETE FROM pending_registrations WHERE id = ?', [pending.id])
    throw new Error('Bu email zaten kayıtlı')
  }

  const result = await db.run(
    'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)',
    [payload.name, email, payload.phone || null, payload.passwordHash]
  )

  const user = {
    id: result.lastID,
    name: payload.name,
    email,
    phone: payload.phone || null,
    verificationMethod,
  }

  const token = generateToken({ id: user.id, email: user.email })

  await db.run('DELETE FROM pending_registrations WHERE id = ?', [pending.id])

  return { user, token }
}

// Middleware: Authentication
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ success: false, error: 'Token required' })
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(401).json({ success: false, error: 'Invalid token' })
  }

  req.user = decoded
  next()
}

// ============ USER ENDPOINTS ============

// User Registration
app.post('/api/register-user', async (req,res)=>{
  return res.status(403).json({
    success: false,
    error: 'Dogrudan kayit kapali. Once /api/register/start-user ile kaydi baslatin, sonra SMS veya Google ile dogrulayin.',
  })
})

// Legacy alias to avoid route-not-found for old clients
app.post('/api/register', (req, res) => {
  return res.status(403).json({
    success: false,
    error: 'Bu endpoint artik desteklenmiyor. /api/register/start-user veya /api/register-company kullanin.',
  })
})

// Step 1: Start pending registration
app.post('/api/register/start-user', async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body
    const normalizedEmail = normalizeEmail(email)

    if (!name || !normalizedEmail || !password || !phone) {
      return res.status(400).json({ success: false, error: 'Eksik alanı doldurunuz' })
    }

    if (!isValidTurkeyPhone(phone)) {
      return res.status(400).json({ success: false, error: 'Eksik alanı doldurunuz' })
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Şifre en az 6 karakter olmalı' })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, error: 'Şifreler eşleşmiyor' })
    }

    const existing = await db.get('SELECT id FROM users WHERE email = ?', [normalizedEmail])
    if (existing) {
      return res.status(400).json({ success: false, error: 'Bu email zaten kayıtlı' })
    }

    await db.run('DELETE FROM pending_registrations WHERE email = ?', [normalizedEmail])

    const pendingToken = createPendingToken()
    const smsCode = createOtpCode()
    const passwordHash = await hashPassword(password)
    const expiresAt = expiresAtIso(REGISTER_OTP_EXPIRES_MINUTES)

    const payload = JSON.stringify({
      name: String(name).trim(),
      email: normalizedEmail,
      phone: (phone || '').trim() || null,
      passwordHash,
    })

    await db.run(
      `INSERT INTO pending_registrations
       (token, accountType, email, phone, payload, smsCode, smsSentAt, expiresAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, CURRENT_TIMESTAMP)`,
      [pendingToken, 'user', normalizedEmail, (phone || '').trim() || null, payload, smsCode, expiresAt]
    )

    let smsResult = null
    if ((phone || '').trim()) {
      smsResult = await sendVerificationSms(phone, smsCode)
    }

    res.status(201).json({
      success: true,
      pendingToken,
      expiresInMinutes: REGISTER_OTP_EXPIRES_MINUTES,
      smsAvailable: Boolean((phone || '').trim()),
      smsProvider: smsResult?.provider || SMS_PROVIDER,
      demoSmsCode: SMS_PROVIDER === 'mock' ? smsCode : undefined,
      message: 'Kayıt başlatıldı. Google veya SMS ile doğrulayarak tamamlayın.',
    })
  } catch (error) {
    console.error('Start register error:', error)
    res.status(500).json({ success: false, error: 'Kayıt başlatılamadı' })
  }
})

// Step 2A: Resend SMS code
app.post('/api/register/resend-sms', async (req, res) => {
  try {
    const { pendingToken } = req.body
    if (!pendingToken) {
      return res.status(400).json({ success: false, error: 'pendingToken gerekli' })
    }

    const pending = await db.get(
      'SELECT id, phone FROM pending_registrations WHERE token = ? AND accountType = ?',
      [pendingToken, 'user']
    )

    if (!pending) {
      return res.status(404).json({ success: false, error: 'Bekleyen kayıt bulunamadı' })
    }

    if (!pending.phone) {
      return res.status(400).json({ success: false, error: 'Bu kayıt için telefon bilgisi yok' })
    }

    const smsCode = createOtpCode()
    const expiresAt = expiresAtIso(REGISTER_OTP_EXPIRES_MINUTES)

    await db.run(
      `UPDATE pending_registrations
       SET smsCode = ?, smsSentAt = CURRENT_TIMESTAMP, expiresAt = ?, updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [smsCode, expiresAt, pending.id]
    )

    const smsResult = await sendVerificationSms(pending.phone, smsCode)

    res.json({
      success: true,
      message: 'SMS doğrulama kodu yeniden gönderildi',
      expiresInMinutes: REGISTER_OTP_EXPIRES_MINUTES,
      smsProvider: smsResult?.provider || SMS_PROVIDER,
      demoSmsCode: SMS_PROVIDER === 'mock' ? smsCode : undefined,
    })
  } catch (error) {
    console.error('Resend SMS error:', error)
    res.status(500).json({ success: false, error: 'SMS kodu gönderilemedi' })
  }
})

// Step 2B: Verify by SMS code and complete registration
app.post('/api/register/verify-sms', async (req, res) => {
  try {
    const { pendingToken, smsCode } = req.body

    if (!pendingToken || !smsCode) {
      return res.status(400).json({ success: false, error: 'pendingToken ve smsCode zorunludur' })
    }

    const pending = await db.get(
      `SELECT * FROM pending_registrations
       WHERE token = ? AND accountType = ?`,
      [pendingToken, 'user']
    )

    if (!pending) {
      return res.status(404).json({ success: false, error: 'Bekleyen kayıt bulunamadı' })
    }

    if (isExpired(pending.expiresAt)) {
      await db.run('DELETE FROM pending_registrations WHERE id = ?', [pending.id])
      return res.status(400).json({ success: false, error: 'Doğrulama süresi doldu. Lütfen tekrar kayıt olun.' })
    }

    if (String(pending.smsCode) !== String(smsCode).trim()) {
      return res.status(400).json({ success: false, error: 'SMS doğrulama kodu hatalı' })
    }

    const { user, token } = await completePendingUserRegistration(pending, 'sms')

    res.json({
      success: true,
      message: 'SMS doğrulaması tamamlandı, kayıt oluşturuldu',
      user,
      token,
    })
  } catch (error) {
    if (error.message === 'Bu email zaten kayıtlı') {
      return res.status(400).json({ success: false, error: error.message })
    }

    console.error('Verify SMS register error:', error)
    res.status(500).json({ success: false, error: 'SMS doğrulaması başarısız' })
  }
})

// Step 2C: Verify by Google token and complete registration
app.post('/api/register/verify-google', async (req, res) => {
  try {
    const { pendingToken, idToken } = req.body

    if (!pendingToken || !idToken) {
      return res.status(400).json({ success: false, error: 'pendingToken ve idToken zorunludur' })
    }

    const pending = await db.get(
      `SELECT * FROM pending_registrations
       WHERE token = ? AND accountType = ?`,
      [pendingToken, 'user']
    )

    if (!pending) {
      return res.status(404).json({ success: false, error: 'Bekleyen kayıt bulunamadı' })
    }

    if (isExpired(pending.expiresAt)) {
      await db.run('DELETE FROM pending_registrations WHERE id = ?', [pending.id])
      return res.status(400).json({ success: false, error: 'Doğrulama süresi doldu. Lütfen tekrar kayıt olun.' })
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    })

    const googleEmail = normalizeEmail(ticket.getPayload()?.email)
    if (!googleEmail) {
      return res.status(400).json({ success: false, error: 'Google hesabından email alınamadı' })
    }

    if (googleEmail !== normalizeEmail(pending.email)) {
      return res.status(400).json({ success: false, error: 'Google email ile kayıt email aynı olmalıdır' })
    }

    const { user, token } = await completePendingUserRegistration(pending, 'google')

    res.json({
      success: true,
      message: 'Google doğrulaması tamamlandı, kayıt oluşturuldu',
      user,
      token,
    })
  } catch (error) {
    if (error.message === 'Bu email zaten kayıtlı') {
      return res.status(400).json({ success: false, error: error.message })
    }

    console.error('Verify Google register error:', error)
    res.status(500).json({ success: false, error: 'Google doğrulaması başarısız' })
  }
})

// User Login
app.post('/api/login', async (req,res)=>{
  try {
    const { identifier, password } = req.body

    if (!identifier || !password) {
      return res.status(400).json({ success: false, error: 'Email/Telefon ve password gerekli' })
    }

    const user = await db.get(
      'SELECT * FROM users WHERE email = ? OR phone = ?',
      [identifier, identifier]
    )

    if (!user) {
      return res.status(401).json({ success: false, error: 'Kullanıcı bulunamadı' })
    }

    const passwordValid = await comparePassword(password, user.password)
    if (!passwordValid) {
      return res.status(401).json({ success: false, error: 'Hatalı password' })
    }

    const token = generateToken({ id: user.id, email: user.email })

    res.json({
      success: true,
      message: 'Giriş başarılı',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isCompany: false
      },
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

// ============ FIRM ENDPOINTS ============

// Firm Registration
app.post('/api/register-company', async (req,res)=>{
  try {
    const {
      name, email, phone, taxNumber, city, district,
      toCity, toDistrict, password, confirmPassword, description
    } = req.body

    if (!name || !email || !taxNumber || !password || !city || !toCity || !phone) {
      return res.status(400).json({ success: false, error: 'Eksik alanı doldurunuz' })
    }

    if (!isValidTurkeyPhone(phone)) {
      return res.status(400).json({ success: false, error: 'Eksik alanı doldurunuz' })
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password en az 6 karakter olmalı' })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, error: 'Passwords eşleşmiyor' })
    }

    const existing = await db.get(
      'SELECT id FROM firms WHERE email = ? OR taxNumber = ?',
      [email, taxNumber]
    )
    if (existing) {
      return res.status(400).json({ success: false, error: 'Bu email veya vergi numarası zaten kayıtlı' })
    }

    const hashedPassword = await hashPassword(password)
    const result = await db.run(
      `INSERT INTO firms (
        name, email, phone, taxNumber, city,
        district, toCity, toDistrict, password,
        description, loadStatus
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, taxNumber, city, district || null, toCity,
       toDistrict || null, hashedPassword, description || null, 'Boş']
    )

    const firm = {
      id: result.lastID,
      name,
      email,
      phone,
      taxNumber,
      isCompany: true
    }

    const token = generateToken({ id: firm.id, email: firm.email, isCompany: true })

    res.status(201).json({
      success: true,
      ok: true,
      message: 'Firma kayıt başarılı',
      user: firm,
      token
    })
  } catch (error) {
    console.error('Firm registration error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

// Firm Login
app.post('/api/login-company', async (req,res)=>{
  try {
    const { identifier, taxNumber } = req.body

    if (!identifier || !taxNumber) {
      return res.status(400).json({ success: false, error: 'Firma adı/Email ve vergi numarası gerekli' })
    }

    const firm = await db.get(
      'SELECT * FROM firms WHERE (email = ? OR name = ?) AND taxNumber = ?',
      [identifier, identifier, taxNumber]
    )

    if (!firm) {
      return res.status(401).json({ success: false, error: 'Firma bulunamadı' })
    }

    const token = generateToken({ id: firm.id, email: firm.email, isCompany: true })

    res.json({
      success: true,
      message: 'Giriş başarılı',
      user: {
        id: firm.id,
        name: firm.name,
        email: firm.email,
        phone: firm.phone,
        taxNumber: firm.taxNumber,
        city: firm.city,
        district: firm.district,
        toCity: firm.toCity,
        toDistrict: firm.toDistrict,
        description: firm.description,
        loadStatus: firm.loadStatus,
        price: firm.price,
        rating: firm.rating,
        isCompany: true
      },
      token
    })
  } catch (error) {
    console.error('Firm login error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

// Google OAuth Login/Register
app.post('/api/login-google', async (req, res) => {
  try {
    const { idToken } = req.body
    console.log('📱 Google Login Request - Token uzunluğu:', idToken?.length)
    
    if (!idToken) {
      return res.status(400).json({ success: false, error: 'ID token gerekli' })
    }

    // Google ID token'ı doğrula
    console.log('🔐 Google Client ID:', GOOGLE_CLIENT_ID?.substring(0, 20) + '...')
    
    const ticket = await googleClient.verifyIdToken({
      idToken: idToken,
      audience: GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    const { email, name, picture } = payload
    console.log('✅ Google token doğrulandı. Email:', email)

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email adresine ulaşılamadı' })
    }

    // Mevcut kullanıcıyı kontrol et
    let user = await db.get('SELECT * FROM users WHERE email = ?', [email])

    if (user) {
      // Kullanıcı zaten var, giriş yap
      const token = generateToken({ id: user.id, email: user.email })
      return res.json({
        success: true,
        message: 'Google ile giriş başarılı',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          picture: user.picture || picture,
        },
        token,
      })
    }

    // Yeni kullanıcı oluştur - Google ile kayıt
    // Rastgele şifre oluştur (Google hesabı kullanılacağı için güvenlik sorunu yok)
    const randomPassword = await bcrypt.hash(Math.random().toString(36).substring(7), SALT_ROUNDS)

    const result = await db.run(
      'INSERT INTO users (name, email, password, phone, picture) VALUES (?, ?, ?, ?, ?)',
      [name || 'Google User', email, randomPassword, null, picture || null]
    )

    const newUser = await db.get('SELECT * FROM users WHERE id = ?', [result.lastID])
    const token = generateToken({ id: newUser.id, email: newUser.email })

    res.json({
      success: true,
      message: 'Google ile kayıt başarılı',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        picture: newUser.picture || picture,
      },
      token,
    })
  } catch (error) {
    console.error('❌ Google OAuth Error:', {
      message: error.message,
      code: error.code,
      status: error.status,
      details: error.getDetails?.()
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
      success: false, 
      error: errorMsg,
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Get all firms
app.get('/api/firms', async (req,res)=>{
  try {
    const firms = await db.all(`
      SELECT id, name, email, phone, city, district,
             toCity, toDistrict, loadStatus, price, pricePerKm,
             rating, description, createdAt
      FROM firms
      ORDER BY createdAt DESC
    `)

    for (const firm of firms) {
      const photos = await db.all('SELECT path FROM photos WHERE firmId = ? ORDER BY uploadedAt DESC', [firm.id])
      firm.photos = photos.map((photo) => photo.path)
    }

    res.json({ success: true, data: firms })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

// Get single firm
app.get('/api/firms/:id', async (req,res)=>{
  try {
    const firm = await db.get(
      `SELECT * FROM firms WHERE id = ?`,
      req.params.id
    )

    if (!firm) {
      return res.status(404).json({ success: false, error: 'Firma bulunamadı' })
    }

    const photos = await db.all('SELECT id, path, uploadedAt FROM photos WHERE firmId = ? ORDER BY uploadedAt DESC', [req.params.id])
    firm.photos = photos

    res.json({ success: true, data: firm })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

// Update firm
app.post('/api/firms/:id/update', authMiddleware, async (req,res)=>{
  try {
    if (req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ success: false, error: 'Unauthorized' })
    }

    const { name, phone, description, loadStatus, price, pricePerKm, city, district, toCity, toDistrict } = req.body

    await db.run(
      `UPDATE firms SET name = ?, phone = ?, description = ?,
        loadStatus = ?, price = ?, pricePerKm = ?,
        city = ?, district = ?, toCity = ?, toDistrict = ?,
        updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      [name, phone, description, loadStatus, price, pricePerKm, city, district, toCity, toDistrict, req.params.id]
    )

    const firm = await db.get('SELECT * FROM firms WHERE id = ?', req.params.id)
    res.json({ success: true, message: 'Firma güncellendi', data: firm })
  } catch (error) {
    console.error('Update firm error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

// ============ PRICES ENDPOINTS ============

app.get('/api/firms/:id/prices', async (req,res)=>{
  try {
    const prices = await db.all(
      'SELECT id, fromCity, toCity, price, createdAt FROM prices WHERE firmId = ? ORDER BY createdAt DESC',
      req.params.id
    )

    res.json({ success: true, data: prices })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

app.post('/api/firms/:id/prices', authMiddleware, async (req,res)=>{
  try {
    if (req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ success: false, error: 'Unauthorized' })
    }

    const { fromCity, toCity, price } = req.body

    if (!fromCity || !toCity || !price) {
      return res.status(400).json({ success: false, error: 'Tüm alanları doldurun' })
    }

    const result = await db.run(
      'INSERT INTO prices (firmId, fromCity, toCity, price) VALUES (?, ?, ?, ?)',
      [req.params.id, fromCity, toCity, price]
    )

    res.status(201).json({
      success: true,
      message: 'Fiyat eklendi',
      data: { id: result.lastID, firmId: req.params.id, fromCity, toCity, price }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

app.delete('/api/prices/:id', authMiddleware, async (req,res)=>{
  try {
    const price = await db.get('SELECT firmId FROM prices WHERE id = ?', req.params.id)

    if (!price || price.firmId !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized' })
    }

    await db.run('DELETE FROM prices WHERE id = ?', req.params.id)
    res.json({ success: true, message: 'Fiyat silindi' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

// ============ QUOTE & CHECKOUT ENDPOINTS ============

async function resolveRoutePrice(firmId, fromCity, toCity) {
  const customPrice = await db.get(
    `SELECT price
     FROM prices
     WHERE firmId = ?
       AND LOWER(fromCity) = LOWER(?)
       AND LOWER(toCity) = LOWER(?)
     ORDER BY id DESC
     LIMIT 1`,
    [firmId, fromCity, toCity]
  )

  if (customPrice?.price) {
    return Number(customPrice.price)
  }

  const firm = await db.get('SELECT price, pricePerKm FROM firms WHERE id = ?', [firmId])
  if (!firm) {
    return null
  }

  const fallback = Number(firm.price || firm.pricePerKm || 0)
  return fallback > 0 ? fallback : null
}

function maskCardNumber(cardNumber) {
  const digits = String(cardNumber || '').replace(/\D/g, '')
  if (digits.length < 4) return '**** **** **** ****'
  return `**** **** **** ${digits.slice(-4)}`
}

app.post('/api/quotes', async (req, res) => {
  try {
    const { firmId, fromCity, toCity, moveDate } = req.body

    if (!firmId || !fromCity || !toCity || !moveDate) {
      return res.status(400).json({ success: false, error: 'Firma, güzergah ve tarih zorunludur' })
    }

    const firm = await db.get('SELECT id, name FROM firms WHERE id = ?', [firmId])
    if (!firm) {
      return res.status(404).json({ success: false, error: 'Firma bulunamadı' })
    }

    const amount = await resolveRoutePrice(firmId, fromCity, toCity)
    if (!amount) {
      return res.status(404).json({ success: false, error: 'Bu rota için fiyat bulunamadı' })
    }

    res.json({
      success: true,
      data: {
        firmId,
        firmName: firm.name,
        fromCity,
        toCity,
        moveDate,
        amount,
        currency: 'TRY'
      }
    })
  } catch (error) {
    console.error('Quote error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

app.post('/api/payments/checkout', async (req, res) => {
  try {
    const {
      firmId,
      fromCity,
      toCity,
      moveDate,
      cardHolder,
      cardNumber,
      expiry,
      cvv
    } = req.body

    if (!firmId || !fromCity || !toCity || !moveDate || !cardHolder || !cardNumber || !expiry || !cvv) {
      return res.status(400).json({ success: false, error: 'Ödeme için tüm alanlar zorunludur' })
    }

    const amount = await resolveRoutePrice(firmId, fromCity, toCity)
    if (!amount) {
      return res.status(404).json({ success: false, error: 'Bu rota için fiyat bulunamadı' })
    }

    const booking = await db.run(
      `INSERT INTO booking_orders
       (firmId, fromCity, toCity, moveDate, amount, status, cardHolder, maskedCard)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [firmId, fromCity, toCity, moveDate, amount, 'pending_3d', cardHolder, maskCardNumber(cardNumber)]
    )

    const threeDSCode = '123456'

    const payment = await db.run(
      `INSERT INTO payment_transactions
       (bookingId, status, threeDSCode)
       VALUES (?, ?, ?)`,
      [booking.lastID, 'pending_3d', threeDSCode]
    )

    res.status(201).json({
      success: true,
      message: '3D Secure doğrulaması gerekli',
      data: {
        bookingId: booking.lastID,
        paymentId: payment.lastID,
        amount,
        currency: 'TRY',
        threeDSecureRequired: true,
        demoOtp: threeDSCode
      }
    })
  } catch (error) {
    console.error('Checkout error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

app.post('/api/payments/3d-secure/verify', async (req, res) => {
  try {
    const { paymentId, otp } = req.body

    if (!paymentId || !otp) {
      return res.status(400).json({ success: false, error: 'Payment ID ve OTP zorunludur' })
    }

    const payment = await db.get(
      'SELECT id, bookingId, status, threeDSCode FROM payment_transactions WHERE id = ?',
      [paymentId]
    )

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Ödeme kaydı bulunamadı' })
    }

    if (payment.status === 'paid') {
      return res.json({ success: true, message: 'Ödeme zaten tamamlanmış' })
    }

    if (String(payment.threeDSCode) !== String(otp)) {
      return res.status(400).json({ success: false, error: '3D Secure kodu hatalı' })
    }

    await db.run(
      `UPDATE payment_transactions
       SET status = 'paid', threeDSVerifiedAt = CURRENT_TIMESTAMP, updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [paymentId]
    )

    await db.run(
      `UPDATE booking_orders
       SET status = 'paid', updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [payment.bookingId]
    )

    res.json({ success: true, message: 'Ödeme başarılı, rezervasyon oluşturuldu' })
  } catch (error) {
    console.error('3D verify error:', error)
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

// ============ MESSAGES ENDPOINTS ============

app.post('/api/messages', async (req,res)=>{
  try {
    const { firmId, senderId, senderName, senderEmail, message } = req.body

    if (!firmId || !senderName || !senderEmail || !message) {
      return res.status(400).json({ success: false, error: 'Tüm alanları doldurun' })
    }

    const firm = await db.get('SELECT id FROM firms WHERE id = ?', firmId)
    if (!firm) {
      return res.status(404).json({ success: false, error: 'Firma bulunamadı' })
    }

    let result

    try {
      result = await db.run(
        `INSERT INTO messages (firmId, senderId, senderName, senderEmail, message)
         VALUES (?, ?, ?, ?, ?)`,
        [firmId, senderId || null, senderName, senderEmail, message]
      )
    } catch (insertError) {
      const msg = String(insertError?.message || '')
      const isLegacySchema = msg.includes('NOT NULL constraint failed: messages.fromUser') || msg.includes('no such column: firmId')

      if (!isLegacySchema) {
        throw insertError
      }

      result = await db.run(
        `INSERT INTO messages (fromUser, toFirm, content, firmId, senderId, senderName, senderEmail, message)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [senderName, firmId, message, firmId, senderId || null, senderName, senderEmail, message]
      )
    }

    res.status(201).json({
      success: true,
      message: 'Mesaj gönderildi',
      data: { id: result.lastID, firmId, senderName, senderEmail, message }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

app.get('/api/messages/:firmId', async (req,res)=>{
  try {
    const firmId = Number(req.params.firmId)
    if (!Number.isInteger(firmId) || firmId <= 0) {
      return res.status(400).json({ success: false, error: 'Geçersiz firma ID' })
    }

    const messages = await db.all(
      `SELECT
         id,
         COALESCE(senderName, fromUser) as senderName,
         senderEmail,
         COALESCE(message, content) as message,
         COALESCE(firmId, toFirm) as firmId,
         senderId,
         createdAt
       FROM messages
       WHERE COALESCE(firmId, toFirm) = ?
       ORDER BY createdAt DESC
       LIMIT 50`,
      firmId
    )

    res.json({ success: true, data: messages })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

// ============ FILE UPLOAD ============

app.post('/api/upload', upload.single('file'), async (req,res)=>{
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Dosya gerekli' })
    }

    res.json({
      success: true,
      data: {
        fileName: req.file.filename,
        originalName: req.file.originalname,
        path: `/uploads/${req.file.filename}`
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

app.post('/api/firms/:id/photos', authMiddleware, upload.single('file'), async (req,res)=>{
  try {
    if (req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ success: false, error: 'Unauthorized' })
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Dosya gerekli' })
    }

    const photoPath = `/uploads/${req.file.filename}`

    await db.run('INSERT INTO photos (firmId, path) VALUES (?, ?)', [req.params.id, photoPath])

    const photos = await db.all('SELECT id, path, uploadedAt FROM photos WHERE firmId = ? ORDER BY uploadedAt DESC', [req.params.id])

    res.status(201).json({ success: true, message: 'Fotoğraf yüklendi', photos })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' })
  }
})

// ============ HEALTH CHECK ============

app.get('/api/health', (req,res)=>{
  res.json({
    success: true,
    message: 'Backend is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  })
})

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))

  app.get(/^\/(?!api|uploads).*/, (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

// ============ SPA FALLBACK ROUTING ============

// Serve index.html for all non-API GET requests (SPA routing)
app.get('*', (req, res) => {
  const indexPath = path.join(distDir, 'index.html')
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath)
  } else {
    res.status(404).json({ success: false, error: 'Frontend not built' })
  }
})

// ============ ERROR HANDLING ============

app.use((req,res)=>{
  res.status(404).json({ success: false, error: 'Route not found' })
})

app.use((err,req,res,next)=>{
  console.error('Error:', err)
  res.status(500).json({ success: false, error: 'Internal server error' })
})

// ============ SERVER START ============

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await initDb();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🌍 Production URL: https://tasimacilikrehberi.com`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app
