# Calistirma Rehberi (Portable Paket)

Bu paket, farkli isletim sistemlerinde calismasi icin `node_modules` olmadan hazirlanmistir.

## 1) Gereksinimler
- Node.js 20+
- npm 10+

## 2) Kurulum
```bash
npm ci
```

## 3) Build
```bash
npm run build
```

## 4) Production Baslatma
```bash
npm run start:prod
```

Uygulama: `http://localhost:3001`

## Docker ile
```bash
docker compose up -d --build
```

## Notlar
- `.env` dosyasi paketin icindedir.
- Veritabani dosyalari (`server.db`, `db.sqlite`) ve `uploads/` klasoru paketin icindedir.
