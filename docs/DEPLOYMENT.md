# Production Deployment Checklist

## 1) Ortam değişkenleri

`.env` dosyası oluştur:

```bash
cp .env.example .env
```

En az şu değerleri güncelle:

- `JWT_SECRET`
- `CORS_ORIGINS` (web domainin)
- `PORT`

## 2) Uygulamayı build et

```bash
npm install
npm run build:prod
```

## 3) Sunucuyu çalıştır

```bash
npm run start:prod
```

- Web + API tek sunucuda yayınlanır.
- API: `/api/*`
- Upload: `/uploads/*`

## 4) Docker ile yayın

```bash
docker compose up -d --build
```

## 5) Mobili canlı API'ye bağla

```bash
cd mobile
EXPO_PUBLIC_API_URL=https://senin-domainin.com/api npx expo start
```

## 6) Duman testleri

Aşağıdakileri canlı ortamda kontrol et:

1. Kullanıcı kayıt (`/auth`)
2. Kullanıcı giriş
3. Firma kayıt
4. Firma giriş
5. Mesaj gönderme
6. Firma panelinde fiyat ekle/sil
7. Firma panelinde fotoğraf yükle

## 7) APK dağıtımı

```bash
cd mobile
npx eas build -p android --profile preview
```

Build tamamlanınca EAS linkinden APK indirip kullanıcılarla paylaş.
