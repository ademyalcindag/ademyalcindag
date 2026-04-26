# Production Deployment Checklist

## 1) Google OAuth Setup (ZORUNLU!)

### 1.1) Google Cloud Console'da Authorized Origins Ekle

Eğer "Error 400: origin_mismatch" hatası alırsan, şunu yap:

1. [Google Cloud Console](https://console.cloud.google.com) aç
2. **Select a Project** → Projen seç (veya yeni oluştur)
3. **APIs & Services** → **Credentials** 
4. **OAuth 2.0 Client ID** (703001786924-...) bul ve tıkla
5. **Authorized JavaScript origins** bölümüne production domain'ini ekle:
   ```
   https://www.senin-domainini.com
   https://senin-domainini.com
   ```
   ✅ NOT: `http://` değil `https://` olmalı!
6. **Save** 

### 1.2) Environment Variable'ı Ayarla

`.env` dosyasında:
```
GOOGLE_CLIENT_ID=703001786924-b09c4sm9kpsbpj8t9leallsunng4j9h1.apps.googleusercontent.com
```

---

## 2) Ortam değişkenleri

`.env` dosyası oluştur:

```bash
cp .env.example .env
```

En az şu değerleri güncelle:

- `JWT_SECRET` - 32+ karakterli rastgele metin
- `GOOGLE_CLIENT_ID` - Google Cloud Console'dan
- `VITE_GOOGLE_CLIENT_ID` - frontend Google client ID
- `CORS_ORIGINS` - production domain'in (virgülle ayır):
  ```
  CORS_ORIGINS=https://www.senin-domainini.com,https://senin-domainini.com
  ```
- `PORT` - genellikle 3001
- `VITE_API_URL` - production domain:
  ```
  VITE_API_URL=https://www.senin-domainini.com
  ```
- `SMS_PROVIDER=twilio`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER`
- `EMAIL_PROVIDER=resend`
- `EMAIL_FROM`
- `RESEND_API_KEY`

Canlı ortam için detaylı kontrol listesi: [docs/HOSTINGER_PRODUCTION_CHECKLIST.md](docs/HOSTINGER_PRODUCTION_CHECKLIST.md)

## 3) Uygulamayı build et

```bash
npm install
npm run build:prod
```

## 4) Sunucuyu çalıştır

```bash
npm run start:prod
```

- Web + API tek sunucuda yayınlanır.
- API: `/api/*`
- Upload: `/uploads/*`

## 5) Docker ile yayın

```bash
docker compose up -d --build
```

## 6) Mobili canlı API'ye bağla

```bash
cd mobile
EXPO_PUBLIC_API_URL=https://senin-domainin.com/api npx expo start
```

## 7) Smoke testleri

Aşağıdakileri canlı ortamda kontrol et:

1. ✅ **Google ile görüş** - "Google ile Kayıt Ol" / "Google ile Giriş Yap" çalışıyor
2. ✅ Kullanıcı kayıt (email + şifre)
3. ✅ E-posta aktivasyon maili geliyor
4. ✅ SMS doğrulama kodu geliyor
3. ✅ Kullanıcı giriş
4. ✅ Firma kayıt
5. ✅ Firma giriş
6. ✅ Mesaj gönderme
7. ✅ Firma panelinde fiyat ekle/sil
8. ✅ Firma panelinde fotoğraf yükle

## 8) APK dağıtımı

```bash
cd mobile
npx eas build -p android --profile preview
```

Build tamamlanınca EAS linkinden APK indirip kullanıcılarla paylaş.

---

## Troubleshooting

### "Error 400: origin_mismatch"
- ✅ Google Cloud Console'da Authorized JavaScript origins'e domain ekle
- ✅ `https://` kullan, `http://` değil
- ✅ `www.` ile ve olmadan ikisini de ekle

### "CORS error"
- ✅ `.env` dosyasında `CORS_ORIGINS` ayarlandığını kontrol et
- ✅ Domain adı tam doğru olduğunu kontrol et (typo yok mu?)

### "Google ile kayıt çalışmıyor"
- ✅ Browser console'da Network tab açıp `/api/login-google` çağrısını kontrol et
- ✅ Response'da ne hata var ise onu oku
- ✅ Backend log'unu kontrol et (`npm run start:prod` output)

