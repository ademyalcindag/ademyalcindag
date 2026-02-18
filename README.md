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

## Mobil Uygulama (Gerçek Backend)

Mobil uygulama varsayılan olarak Expo host’un IP’sini kullanarak `:3001/api` endpointine bağlanır.

Gerekirse manuel API URL ver:

```bash
cd mobile
EXPO_PUBLIC_API_URL=https://senin-domainin.com/api npx expo start
```
