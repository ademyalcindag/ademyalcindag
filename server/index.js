import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const __dirname = path.resolve()
const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

const upload = multer({ dest: uploadDir })

const app = express()
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(uploadDir))

let db
async function initDb(){
  db = await open({ filename: path.join(__dirname, 'server.db'), driver: sqlite3.Database })
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT, phone TEXT, password TEXT, type TEXT);
    CREATE TABLE IF NOT EXISTS firms (id INTEGER PRIMARY KEY, name TEXT, email TEXT, taxNumber TEXT, city TEXT, address TEXT, phone TEXT, loadStatus TEXT, price INTEGER, distanceKm INTEGER, rating REAL, password TEXT);
    CREATE TABLE IF NOT EXISTS photos (id INTEGER PRIMARY KEY, firmId INTEGER, path TEXT);
    CREATE TABLE IF NOT EXISTS campaigns (id INTEGER PRIMARY KEY, firmId INTEGER, title TEXT, description TEXT);
    CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, fromUser TEXT, toFirm INTEGER, content TEXT, createdAt TEXT);
    CREATE TABLE IF NOT EXISTS prices (id INTEGER PRIMARY KEY, firmId INTEGER, fromCity TEXT, toCity TEXT, price INTEGER, estimatedHours REAL);
  `)

  // seed if empty
  const row = await db.get('SELECT COUNT(*) as c FROM firms')
  if(row.c === 0){
    await db.run(`INSERT INTO firms (name,email,taxNumber,city,address,phone,loadStatus,price,distanceKm,rating,password) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      ['Metro Taşıma','metro@tasima.com','1234567890','İstanbul','Kadıköy Mah. 15','+90 532 000 0000','Boş',2500,400,4.5,'password'])
    await db.run(`INSERT INTO firms (name,email,taxNumber,city,address,phone,loadStatus,price,distanceKm,rating,password) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      ['Anadolu Nakliyat','anadolu@nakliyat.com','9876543210','Ankara','Çankaya Cad. 7','+90 532 111 1111','Dolu',3200,250,4.2,'password'])
    const f1 = await db.get('SELECT id FROM firms WHERE name=?', 'Metro Taşıma')
    const f2 = await db.get('SELECT id FROM firms WHERE name=?', 'Anadolu Nakliyat')
    await db.run('INSERT INTO campaigns (firmId,title,description) VALUES (?,?,?)', [f1.id, 'Yaz İndirimi %10','Haziran-Temmuz taşımalarda %10 indirim.'])
    await db.run('INSERT INTO campaigns (firmId,title,description) VALUES (?,?,?)', [f2.id, 'Hafta Sonu Kampanyası','Cumartesi taşımalarda ekstra ekip.'])
    // Seed prices
    await db.run('INSERT INTO prices (firmId,fromCity,toCity,price,estimatedHours) VALUES (?,?,?,?,?)', [f1.id,'İstanbul','Ankara',2500,12])
    await db.run('INSERT INTO prices (firmId,fromCity,toCity,price,estimatedHours) VALUES (?,?,?,?,?)', [f1.id,'İstanbul','İzmir',1800,8])
    await db.run('INSERT INTO prices (firmId,fromCity,toCity,price,estimatedHours) VALUES (?,?,?,?,?)', [f2.id,'Ankara','İstanbul',2500,12])
    await db.run('INSERT INTO prices (firmId,fromCity,toCity,price,estimatedHours) VALUES (?,?,?,?,?)', [f2.id,'Ankara','Gaziantep',3000,14])
  }
}

app.get('/api/firms', async (req,res)=>{
  const rows = await db.all('SELECT * FROM firms')
  for(const r of rows){
    const photos = await db.all('SELECT path FROM photos WHERE firmId=?', r.id)
    r.photos = photos.map(p=>p.path)
  }
  res.json(rows)
})

app.get('/api/firms/:id', async (req,res)=>{
  const id = req.params.id
  const f = await db.get('SELECT * FROM firms WHERE id=?', id)
  if(!f) return res.status(404).json({error:'not found'})
  const photos = await db.all('SELECT path FROM photos WHERE firmId=?', id)
  const campaigns = await db.all('SELECT * FROM campaigns WHERE firmId=?', id)
  f.photos = photos.map(p=>p.path)
  f.campaigns = campaigns
  res.json(f)
})

app.get('/api/campaigns', async (req,res)=>{
  const rows = await db.all('SELECT * FROM campaigns')
  res.json(rows)
})

app.post('/api/register', async (req,res)=>{
  const body = req.body
  if(body.type === 'company'){
    const stmt = await db.run('INSERT INTO firms (name,taxNumber,city,address,phone,loadStatus,price,distanceKm,rating) VALUES (?,?,?,?,?,?,?,?,?)',
      [body.name||'', body.taxNumber||'', body.city||'', body.address||'', body.phone||'', body.loadStatus||'Boş', body.price||0, body.distanceKm||0, body.rating||4.0])
    const id = stmt.lastID
    if(body.photos && Array.isArray(body.photos)){
      for(const p of body.photos) await db.run('INSERT INTO photos (firmId,path) VALUES (?,?)',[id,p])
    }
    const firm = await db.get('SELECT * FROM firms WHERE id=?', id)
    res.json({ok:true, firm})
  } else {
    const stmt = await db.run('INSERT INTO users (name,email,phone,password,type) VALUES (?,?,?,?,?)', [body.name||'', body.email||'', body.phone||'', body.password||'', 'user'])
    const user = await db.get('SELECT * FROM users WHERE id=?', stmt.lastID)
    res.json({ok:true, user})
  }
})

app.post('/api/login', async (req,res)=>{
  const { identifier } = req.body
  // simple login simulation: find by email or phone in users
  const user = await db.get('SELECT * FROM users WHERE email=? OR phone=?', identifier, identifier)
  if(user) return res.json({ok:true,user})
  return res.status(401).json({ok:false})
})

app.post('/api/login-company', async (req,res)=>{
  const { identifier, taxNumber } = req.body
  if(!taxNumber) return res.status(400).json({ok:false, error:'Missing tax number'})
  // Find firm by email/name and verify tax number
  const firm = await db.get('SELECT * FROM firms WHERE (name=? OR email=?) AND taxNumber=?', identifier, identifier, taxNumber)
  if(firm) return res.json({ok:true, firm})
  return res.status(401).json({ok:false})
})

app.post('/api/messages', async (req,res)=>{
  const { fromUser, toFirm, content } = req.body
  await db.run('INSERT INTO messages (fromUser,toFirm,content,createdAt) VALUES (?,?,?,?)', [fromUser,toFirm,content,new Date().toISOString()])
  res.json({ok:true})
})

app.post('/api/upload', upload.single('file'), async (req,res)=>{
  if(!req.file) return res.status(400).json({error:'no file'})
  const p = `/uploads/${req.file.filename}`
  res.json({path:p})
})

app.post('/api/auth/google', async (req,res)=>{
  const { profile } = req.body
  // Google OAuth simülasyonu: profile.id, profile.email, profile.name
  const stmt = await db.run('INSERT OR IGNORE INTO users (name,email,phone,password,type) VALUES (?,?,?,?,?)', [profile.name, profile.email, profile.id, 'oauth_google', 'user'])
  const user = await db.get('SELECT * FROM users WHERE email=?', profile.email)
  res.json({ok:true, user})
})

app.post('/api/auth/facebook', async (req,res)=>{
  const { profile } = req.body
  // Facebook OAuth simülasyonu
  const stmt = await db.run('INSERT OR IGNORE INTO users (name,email,phone,password,type) VALUES (?,?,?,?,?)', [profile.name, profile.email, profile.id, 'oauth_facebook', 'user'])
  const user = await db.get('SELECT * FROM users WHERE email=?', profile.email)
  res.json({ok:true, user})
})

app.post('/api/auth/phone', async (req,res)=>{
  const { phone, name } = req.body
  if(!phone || !name) return res.status(400).json({ok:false, error:'Missing phone or name'})
  // Telefon numarasıyla kayıt
  const existing = await db.get('SELECT * FROM users WHERE phone=?', phone)
  if(existing) return res.json({ok:true, user: existing}) // Zaten kayıtlı
  const stmt = await db.run('INSERT INTO users (name,email,phone,password,type) VALUES (?,?,?,?,?)', [name, `${phone}@phone.local`, phone, phone, 'user'])
  const user = await db.get('SELECT * FROM users WHERE id=?', stmt.lastID)
  res.json({ok:true, user})
})

app.get('/api/messages/:firmId', async (req,res)=>{
  const { firmId } = req.params
  const messages = await db.all('SELECT * FROM messages WHERE toFirm=? ORDER BY createdAt DESC', firmId)
  res.json(messages || [])
})

app.post('/api/firms/:id/update', async (req,res)=>{
  const { id } = req.params
  const { name, email, phone, city, address, taxNumber, price, distanceKm } = req.body
  await db.run('UPDATE firms SET name=?, email=?, phone=?, city=?, address=?, taxNumber=?, price=?, distanceKm=? WHERE id=?',
    [name, email, phone, city, address, taxNumber, price, distanceKm, id])
  const firm = await db.get('SELECT * FROM firms WHERE id=?', id)
  res.json({ok:true, firm})
})

app.post('/api/firms/:id/photos', upload.single('file'), async (req,res)=>{
  const { id } = req.params
  if(!req.file) return res.status(400).json({error:'no file'})
  const path = `/uploads/${req.file.filename}`
  await db.run('INSERT INTO photos (firmId, path) VALUES (?,?)', [id, path])
  const photos = await db.all('SELECT path FROM photos WHERE firmId=?', id)
  res.json({ok:true, photos: photos.map(p=>p.path)})
})

app.get('/api/firms/:id/prices', async (req,res)=>{
  const { id } = req.params
  const prices = await db.all('SELECT * FROM prices WHERE firmId=? ORDER BY id', id)
  res.json(prices || [])
})

app.post('/api/firms/:id/prices', async (req,res)=>{
  const { id } = req.params
  const { fromCity, toCity, price, estimatedHours } = req.body
  await db.run('INSERT INTO prices (firmId, fromCity, toCity, price, estimatedHours) VALUES (?,?,?,?,?)',
    [id, fromCity, toCity, price, estimatedHours])
  const prices = await db.all('SELECT * FROM prices WHERE firmId=?', id)
  res.json({ok:true, prices})
})

app.delete('/api/prices/:priceId', async (req,res)=>{
  const { priceId } = req.params
  await db.run('DELETE FROM prices WHERE id=?', priceId)
  res.json({ok:true})
})

const PORT = process.env.PORT || 4000
initDb().then(()=>{
  app.listen(PORT, ()=>console.log('Server listening on', PORT))
}).catch(err=>{console.error(err); process.exit(1)})
