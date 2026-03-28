# Taşımacılık Rehberi Mobil

Bu mobil proje, web uygulamayı **birebir** (CSS, animasyon, tema paleti, sayfa akışları dahil) WebView içinde çalıştırır.

## Çalıştırma

```bash
cd mobile
npm install
npm start
```

## Tek komutla web + mobil

Proje kök dizininden:

```bash
npm run mobile:start
```

Bu komut web uygulamayı (`vite`, port `5173`) ve Expo mobil geliştirme sunucusunu birlikte başlatır.

## Önerilen ortam değişkeni

`.env` dosyasında mobilin açacağı web adresini tanımlayın:

```bash
EXPO_PUBLIC_WEB_APP_URL=http://localhost:5173
```

Tanımlanmazsa uygulama, geliştirici makinesinin IP/host bilgisinden otomatik URL üretmeyi dener.

## Mimari

- `app/index.tsx`: WebView ile web uygulamayı açar
- `app/_layout.tsx`: Tek ekran root stack

## Hedef

Mobilde görülen ekran, web uygulamanın birebir aynısıdır. Webde yapılan görsel/tema/animasyon güncellemeleri mobilde de aynı şekilde görünür.