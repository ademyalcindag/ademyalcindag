# Hostinger Production Checklist

Bu liste canlı siteye geçmeden hemen önce ve deploy sonrası kontrol için hazırlanmıştır.

## 1. Hostinger Node.js Ayarları

Panelde şu değerleri doğrula:

- Node.js version: 20+
- Application root: `/`
- Startup file: `server/server.js`
- PM2: açık
- Branch: `main`

## 2. Zorunlu Environment Variables

Canlıda aşağıdaki değerler tanımlı olmalı:

```bash
NODE_ENV=production
PORT=3001
JWT_SECRET=buraya-32-karakterden-uzun-rastgele-bir-secret-yaz

GOOGLE_CLIENT_ID=buraya-google-web-client-id
VITE_GOOGLE_CLIENT_ID=buraya-google-web-client-id
VITE_API_URL=https://www.tasimacilikrehberi.com
VITE_CANONICAL_HOST=www.tasimacilikrehberi.com
CORS_ORIGINS=https://www.tasimacilikrehberi.com,https://tasimacilikrehberi.com

SMS_PROVIDER=disabled
SMS_DEFAULT_COUNTRY_CODE=+90

EMAIL_PROVIDER=resend
EMAIL_FROM=no-reply@tasimacilikrehberi.com
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

## 3. Google OAuth Kontrolü

Google Cloud Console içinde Authorized JavaScript origins alanında şunlar olmalı:

```text
https://www.tasimacilikrehberi.com
https://tasimacilikrehberi.com
```

## 4. Deploy Sırası

Sunucuda veya Hostinger Git deploy akışında şu sırayı kullan:

```bash
npm install
npm run build:prod
npm run start:prod
```

## 5. Kayıt Akışı Smoke Test

Canlı ortamda şu senaryoları tek tek kontrol et:

1. Kişi hesabı normal kayıt formu açılıyor.
2. Kişi hesabı Google ile kayıt butonu görünüyor.
3. Kayıt başlatıldığında e-posta aktivasyon maili gerçekten geliyor.
4. E-posta doğrulama çalışıyor.
5. Google ile e-posta doğrulama çalışıyor.
6. Kayıt sonrası giriş yapılabiliyor.

## 6. Uygulama Smoke Test

1. Navbar'da kullanıcı adına tıklayınca hesap alanı açılıyor.
2. Kullanıcı profil bilgilerini güncelleyebiliyor.
3. Kullanıcı mesajlaştığı firmaları görebiliyor.
4. Firma panelinde sohbetler ve yeni mesajlar görünüyor.
5. Firma yanıt verdiğinde kullanıcı sohbet ekranında devam edebiliyor.
6. Ana sayfada haritadan Türkiye içinde iki nokta seçilebiliyor.

## 7. Hata Durumları

- Eğer uygulama production'da `EMAIL_PROVIDER=mock` ile açılırsa backend artık bilerek ayağa kalkmaz.
- Eğer Google popup açılmazsa önce origin ayarını ve `VITE_GOOGLE_CLIENT_ID` değerini kontrol et.
- Eğer mail gitmezse önce Resend domain doğrulamasını ve `EMAIL_FROM` adresini kontrol et.