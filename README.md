# Taşımacılık Rehberi

Web + mobil istemcisi olan, JWT kimlik doğrulama ve kalıcı veritabanı (SQLite dosyası) kullanan taşımacılık platformu.

## Özellikler

- Kullanıcı kayıt / giriş
- Firma kayıt / giriş
- Firma profil güncelleme
- Firma fiyat listesi ekleme/silme
- Firma mesajlaşma
- Fotoğraf yükleme
- Mobil uygulama (Expo) API entegrasyonu

## Yerel Geliştirme

```bash
npm install
npm run server   # API: http://localhost:3001
npm run dev      # Web: http://localhost:5173
```

> Vite proxy varsayılan olarak `http://localhost:3001` backend’ine gider.

## Tek Servis Prod Çalıştırma

Web build’i backend tarafından da servis edilir:

```bash
npm install
npm run build:prod
npm run start:prod
```

Bu modda hem API hem web aynı porttan çalışır (varsayılan `3001`).

## Docker ile Yayın Benzeri Kurulum

```bash
cp .env.example .env
docker compose up -d --build
```

- Uygulama: `http://localhost:3001`
- API health: `http://localhost:3001/api/health`
- Veritabanı: `/data/server.db` (named volume ile kalıcı)

## Hostinger Node.js Hosting'e Yayınlama

### Otomatik Yayınlama Script'i

```bash
npm run deploy:hostinger
```

Bu komut otomatik olarak build yapar ve Hostinger için hazırlar.

### Manuel Yayınlama Adımları

1. **Hostinger Panel'e Giriş Yapın**
   - https://www.hostinger.com/ hesabınıza giriş yapın

2. **Node.js Hosting'e Git**
   - Dashboard'dan Node.js hosting planınızı seçin

3. **GitHub'dan Deploy Et (Önerilen)**
   - Hostinger panelinde "Git" sekmesine gidin
   - Repository URL: `https://github.com/ademyalcindag/ademyalcindag`
   - Branch: `main`
   - Build Command: `npm run build`
   - Start Command: `npm start`

4. **Manuel Upload (Alternatif)**
   - FTP ile tüm dosyaları upload edin
   - Hostinger panelinde:
     - Node.js version: 18+
     - Application root: `/`
     - Startup file: `server/server.js`
     - PM2 process manager: Enable

5. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=3001
   JWT_SECRET=your-secret-key
   ```

### Hostinger Yapılandırması

- **PM2 Ecosystem**: `ecosystem.config.json` dosyası otomatik yüklenir
- **SPA Routing**: `dist/.htaccess` dosyası React Router için gerekli
- **Database**: SQLite dosyası otomatik oluşturulur
- **Static Files**: `dist/` klasöründen serve edilir

### Site URL

Yayınlandıktan sonra siteniz şu adreste olacak:
`https://your-domain.hostinger.com`

### Sorun Giderme

Eğer hata alırsanız:
1. Hostinger panelinde logs'u kontrol edin
2. `npm run build` komutunu yerel olarak test edin
3. Database dosyasının yazılabilir olduğundan emin olun

Gerekirse manuel API URL ver:

```bash
cd mobile
EXPO_PUBLIC_API_URL=https://senin-domainin.com/api npx expo start
```
