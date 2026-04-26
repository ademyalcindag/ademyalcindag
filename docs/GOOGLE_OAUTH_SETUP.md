# Google OAuth Setup - Adım Adım Kılavuz

## Problem
Hostinger'da yayında "Error 400: origin_mismatch" hatası alıyorsun?

## Çözüm

### Step 1: Google Cloud Console'a Git

1. [https://console.cloud.google.com](https://console.cloud.google.com) aç
2. Sağ üstte bir **Project** seç veya yeni oluştur
3. Sol sidebar'da **APIs & Services** → **Credentials**

### Step 2: OAuth Credential'ı Bul

Credentials listesinde "OAuth 2.0 Client ID" ile başlayan bir entry bul:
```
Name: "Web client 1" (veya benzeri)
Application type: Web application
Client ID: 703001786924-b09c4sm9kpsbpj8t9leallsunng4j9h1.apps.googleusercontent.com
```

Bu credential'a tıkla.

### Step 3: Authorized JavaScript Origins Ekle

Açılan modal'da **Authorized JavaScript origins** bölümünü bul.

Production domain'ini ekle (2 satır olarak):

```
https://www.tasimacilikrehberi.com
https://tasimacilikrehberi.com
```

⚠️ **ÖNEMLİ:**
- `http://` değil `https://` yaz
- `www.` ile ve olmadan **İKİSİNİ** de ekle
- Localhost ve production ayrı ayrı manage etmen gerekebilir

### Step 3.1: `xn--...` görünmesini istemiyorsan

Google hesabı seçim ekranında `xn--...` görünmesi, domain'in IDN/punycode olarak algılanmasından kaynaklanır.

İstediğin görünüm için:

1. Girişi ASCII domaine taşı (`tasimacilikrehberi.com` gibi, Türkçe karakter içermeyen host)
2. `.env` içine canonical host ekle:

```
VITE_CANONICAL_HOST=www.tasimacilikrehberi.com
```

Bu projede frontend, `xn--` hosttan açılırsa otomatik olarak `VITE_CANONICAL_HOST` değerine yönlendirir.

### Step 4: Değişiklikleri Kaydet

Sayfanın alt kısmında mavi **Save** butonuna tıkla.

### Step 5: Backend Environment Variable'ı Kontrol Et

Hostinger panel'inde (cPanel / SSH) Node.js environment'ında `.env` dosyasını kontrol et:

```bash
# Dosyayı aç
cat .env
```

Şu satırlar olmalı:

```
GOOGLE_CLIENT_ID=703001786924-b09c4sm9kpsbpj8t9leallsunng4j9h1.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_ID=703001786924-b09c4sm9kpsbpj8t9leallsunng4j9h1.apps.googleusercontent.com
CORS_ORIGINS=https://www.tasimacilikrehberi.com,https://tasimacilikrehberi.com
VITE_API_URL=https://www.tasimacilikrehberi.com
PORT=3001
NODE_ENV=production
JWT_SECRET=your-long-random-secret-here
```

### Step 6: Uygulamayı Yeniden Başlat

```bash
npm run build:prod
npm run start:prod
```

Veya Hostinger panel'inde Node.js uygulamasını restart et.

---

## Test Etme

1. Tarayıcıda siteni aç: https://www.tasimacilikrehberi.com
2. Auth sayfasına git
3. "Kullanıcı Girişi" → "Google ile Giriş Yap" butonuna tıkla
4. Google popup açılmalı
5. Hesabını seç → Giriş yapmalısın

## Hala Çalışmıyor Mu?

### 1️⃣ Browser Console'ı Aç (F12)
- Network tab açıp `/api/login-google` çağrısını kontrol et
- Error nedir?

### 2️⃣ Backend Log'unu Kontrol Et
```bash
# SSH'da
tail -f npm-debug.log
# veya
pm2 logs tasimacilik
```

### 3️⃣ Sorunları Gider:

**"origin_mismatch"**
→ Google Cloud Console'da origin eklemediysen bunu yap

**"invalid client"**
→ GOOGLE_CLIENT_ID yanlış mı?

**"CORS error"**
→ CORS_ORIGINS environment variable'ını kontrol et

---

## Developer Links

- 🔐 [Google Cloud Console](https://console.cloud.google.com)
- 📚 [Google OAuth Docs](https://developers.google.com/identity/protocols/oauth2)
- 🐛 [Browser DevTools](chrome://devtools)

---

## Yeni Kayıt Doğrulama (E-posta + SMS)

Kullanıcı kaydında artık iki adım zorunlu:

1. E-posta aktivasyon kodu
2. SMS doğrulama kodu

Backend endpointleri:

- `POST /api/register/start-user`
- `POST /api/register/verify-email`
- `POST /api/register/verify-sms`
- `POST /api/register/resend-sms`

### Environment Variables

`.env` dosyasına aşağıdaki alanları ekle:

```bash
# SMS
SMS_PROVIDER=twilio
SMS_DEFAULT_COUNTRY_CODE=+90
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_FROM_NUMBER=+1...

# E-posta
EMAIL_PROVIDER=resend
EMAIL_FROM=no-reply@tasimacilikrehberi.com
RESEND_API_KEY=re_...
```

### Test Notu

- Production ortamında `mock` sağlayıcı kullanımı kapatıldı.
- Canlı sitede Twilio ve Resend bilgileri tanımlı değilse kayıt servisi ayağa kalkmaz.
