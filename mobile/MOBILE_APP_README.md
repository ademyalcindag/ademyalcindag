# 📱 Taşımacılık Rehberi - Mobil Uygulaması

Expo tabanlı mobil kabuk içinde web uygulamasını birebir gösteren (WebView) sürüm.

## 🎯 Özellikler

- **Web ile birebir görünüm**: Mobil uygulama, web arayüzünü doğrudan render eder.
- **Aynı kullanım akışı**: Menü, sayfalar, formlar ve tüm UI davranışı web ile aynıdır.
- **Aynı backend**: Mobil kabuk, web uygulamanın kullandığı aynı API akışını çalıştırır.
- **Tek kod tabanı avantajı**: Webdeki stil/akış güncellemesi mobilde de otomatik yansır.

## 📋 Ekranlar

### 1. Uygulama (WebView)
- `app/(tabs)/index.tsx` içinde web uygulama URL'sini açar.
- iOS ve Android'de doğrudan uygulama içinde çalışır.
- Expo web çalıştırmasında "Tarayıcıda Aç" ile aynı adrese gider.

## 🚀 Kurulum

### Gereksinimler
- Node.js 16 veya üzeri
- npm veya yarn

### Adımlar

1. **Bağımlılıkları Yükle**
```bash
cd mobile
npm install
```

2. **Ortam Değişkenlerini Ayarla** (önerilir)
```bash
# .env dosyası oluştur (mobilin açacağı web uygulama adresi)
EXPO_PUBLIC_WEB_APP_URL=http://localhost:5173
```

3. **Uygulamayı Çalıştır**

**Web'de Çalıştır:**
```bash
npm run web
```

**iOS Simulator'da Çalıştır (yalnızca macOS):**
```bash
npm run ios
```

**Android Emulator'da Çalıştır:**
```bash
npm run android
```

**Canlı Çalıştır (Telefonda):**
```bash
npm start
```

## 📱 Fiziksel Cihazda Test Etme

1. **Expo Go Uygulamasını İndir**
   - App Store (iOS) veya Google Play Store (Android)

2. **Uygulamayı Başlat**
```bash
npm start
```

3. **QR Kodunu Tara**
   - Terminal'deki QR kodu telefon kamerası ile tara
   - Expo Go'da otomatik olarak açılacak

## 🍎 iOS Notu (Önemli)

- Bu geliştirme ortamı Linux olduğu için iOS Simulator bu makinede açılamaz.
- iOS'ta test için iki yol:
   - **Fiziksel iPhone + Expo Go** (QR ile)
   - **macOS üzerinde** `npm run ios`

## 🔐 Giriş Bilgileri (Demo)

### Kullanıcı Örneği
- E-mail: `user@example.com`
- Parola: `123456`

### Firma Örneği
- Firma Adı: `Örnek Taşımacılık`
- Vergi No: `1234567890`

## 🏗️ Proje Yapısı

```
mobile/
├── app/(tabs)/index.tsx   # WebView ile web uygulama ekranı
├── app/(tabs)/_layout.tsx # Alt sekme düzeni
├── app/_layout.tsx        # Root router düzeni
├── package.json
└── app.json
```

## 🎨 Tasarım Sistem

### Renkler
- **Primary**: `#450ef3` (Mor)
- **Secondary**: `#f3450e` (Turuncu)
- **Accent**: `#a9c400` (Sarı-Yeşil)
- **Danger**: `#dc2626` (Kırmızı)

### Tipografi
- Başlıklar: 20-24px Bold
- Normal metni: 14-16px Regular
- Etiketler: 12px Medium

## 🔗 API Entegrasyonu

Uygulamada kullanılan API endpoints:

```javascript
GET    /api/firms                    # Tüm firmaları getir
GET    /api/firms/:id               # Firma detayını getir
POST   /api/login                   # Kullanıcı girişi
POST   /api/login-company           # Firma girişi
POST   /api/messages                # Mesaj gönder
GET    /api/messages/:firmId        # Firma mesajlarını getir
POST   /api/firms/:id/update        # Firma bilgisini güncelle
GET    /api/firms/:id/prices        # Firma fiyatlarını getir
POST   /api/firms/:id/prices        # Fiyat ekle
DELETE /api/prices/:id              # Fiyat sil
```

## 📚 Kullanılan Kütüphaneler

- **React Native**: Mobil UI framework
- **Expo**: React Native geliştirme platformu
- **React Navigation**: Ekranlar arası navigasyon
- **AsyncStorage**: Lokal veri depolama
- **Ionicons**: İkon kütüphanesi

## 🐛 Troubleshooting

### Bağlantı Sorunu
```bash
# Metro bundler'ı sıfırla
npm start -- --reset-cache
```

### Bağlantı Timeout
API URL'sini kontrol et ve backend'in çalıştığından emin ol:
```javascript
// constants.js veya api.js'de
const API_BASE_URL = 'http://localhost:3001/api' // Doğru URL'yi gir
```

### Modül Bulunamadı
```bash
# Bağımlılıkları yeniden yükle
rm -rf node_modules
npm install
```

## 📝 Lisans

Bu proje MIT lisansı altında yayınlanmıştır.

## 👨‍💻 Geliştirme

Yeni özellikler eklemek için pull request gönderin.

```bash
# Yeni branch oluştur
git checkout -b feature/new-feature

# Değişiklikleri commit et
git commit -am 'Add new feature'

# Branch'ı push et
git push origin feature/new-feature
```

## 📧 İletişim

Sorularınız için (contact information here)
