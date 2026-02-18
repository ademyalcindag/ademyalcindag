# 📱 Taşımacılık Rehberi - Mobil Uygulaması

Modern React Native ve Expo tabanlı, tam fonksiyonlu bir ulaştırma/taşımacılık hizmetleri mobil uygulaması.

## 🎯 Özellikler

### 👤 Kullanıcılar İçin
- **Şirket Arama**: Türkiye'deki tüm şehir ve ilçelerde taşımacı araması
- **Filtreleme**: Başlangıç/hedef şehri, fiyat aralığı, yük durumuna göre filtreleme
- **Detay Görüntüleme**: Şirket hakkında detaylı bilgi
- **İletişim**: Doğrudan şirketlere mesaj gönderme
- **Profil Yönetimi**: Kişisel bilgileri düzenleme

### 🏢 Şirketler İçin
- **Firma Paneli**: Kendi şirket bilgilerini yönetme
- **Rota Yönetimi**: Farklı rotalar için fiyat ekleme/silme
- **Mesaj Takibi**: Müşteri mesajlarını görüntüleme
- **Status Güncellemesi**: Yük durumunu (Boş/Dolu) güncelleme

## 📋 Ekranlar

### 1. Giriş Ekranı (LoginScreen)
- Bireysel/Firma giriş seçeneği
- E-mail/Telefon ile giriş
- Vergi numarası doğrulaması (Firmalar için)

### 2. Ana Sayfa (HomeScreen)
- Firma listesi görüntüleme
- Gelişmiş filtreleme sistemi
- Realtime arama

### 3. Firma Detayları (CompanyDetailsScreen)
- Tam firma bilgileri
- Rota ve fiyat detayları
- Mesaj gönderme formu

### 4. Profil (ProfileScreen)
- Kullanıcı bilgilerini görüntüleme/düzenleme
- Ayarlar
- Çıkış yapma

### 5. Mesajlar (MessagesScreen)
- Firma hesapları için gelen mesajları görüntüleme
- Mesaj detayları ve iletişim bilgileri

### 6. Firma Paneli (CompanyDashboardScreen)
- Firma bilgilerini düzenleme
- Rota fiyatlarını yönetme
- Yük durumu güncelleme

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

2. **Ortam Değişkenlerini Ayarla** (opsiyonel)
```bash
# .env dosyası oluştur
EXPO_PUBLIC_API_URL=http://localhost:3001/api
```

3. **Uygulamayı Çalıştır**

**Web'de Çalıştır:**
```bash
npm run web
```

**iOS Simulator'da Çalıştır:**
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
├── App.js                 # Ana uygulama bileşeni
├── api.js                 # API istemcisi
├── constants.js           # Sabitler (renkler, şehirler vb.)
├── screens/              # Ekran bileşenleri
│   ├── LoginScreen.jsx
│   ├── HomeScreen.jsx
│   ├── CompanyDetailsScreen.jsx
│   ├── ProfileScreen.jsx
│   ├── MessagesScreen.jsx
│   └── CompanyDashboardScreen.jsx
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
