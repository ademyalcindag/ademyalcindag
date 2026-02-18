# Taşımacılık Rehberi - Web & Mobile

Bu proje, taşımacılık ve kargo şirketlerini filtreleme ve listeleme uygulamasıdır. Web, Android ve iPhone versiyonları vardır.

## 📁 Proje Yapısı

```
ademyalcindag/
├── src/                    # Web uygulaması (React + Vite)
│   ├── components/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── mobile/                 # Mobile uygulaması (React Native + Expo)
│   ├── App.js
│   ├── app.json
│   ├── package.json
│   └── assets/
├── server/                 # Backend sunucusu
│   ├── index.js
│   └── backend.js
└── package.json            # Ana proje bağımlılıkları
```

## 🚀 Kurulum

### Web Versiyonu

```bash
cd /workspaces/ademyalcindag
npm install
npm run dev
```

Web uygulaması açılacaktır: http://localhost:5173

### Mobile Versiyonu (Android / iPhone)

#### Gereksinimler:
- Node.js 16 veya üzeri
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (Android için) veya Xcode (iOS için)

#### Kurulum ve Çalıştırma:

```bash
cd /workspaces/ademyalcindag/mobile
npm install
```

**Android için:**
```bash
npm run android
# veya
expo start --android
```

**iOS için (Mac gerekli):**
```bash
npm run ios
# veya
expo start --ios
```

**Web sürümü:**
```bash
npm run web
```

**Expo Go ile Test:**
```bash
expo start
```
Açılan QR kodunu Expo Go uygulamasıyla tarayın.

## ✨ Özellikler

### Filtreler
- ✅ **Nereden/Nereye**: Kalkış ve varış şehri seçimi
- ✅ **İlçe Seçimi**: Seçilen şehirin ilçelerini listele
- ✅ **Min/Max Fiyat**: Türkçe para birimi formatı (₺)
- ✅ **Yük Durumu**: Boş/Dolu seçeneği
- ✅ **Şehir Autocomplete**: Yazarken şehir önerileri

### Görüntüleme
- 📱 Responsive tasarım
- 🔍 Gerçek zamanlı filtreleme
- 💳 Firma kartları (ad, şehir, fiyat, durumu, rating)
- ⚡ Hızlı performans

## 🛠️ Teknolojiler

**Web:**
- React 18+
- Vite
- CSS3

**Mobile:**
- React Native
- Expo
- React Hooks

**Backend:**
- Node.js
- Express (opsiyonel)

## 📊 Veriler

`data.js` dosyası:
- Türkiye'nin 81 şehrini içerir
- 8 ana şehrin ilçelerini listelemektedir
- API endpoints'e bağlanır

### Desteklenen Şehirler (İlçe Seçimi):
- Adana, Ankara, İstanbul, İzmir, Bursa, Gaziantep, Konya, Antalya, Diyarbakır

Diğer şehirler için ilçe seçeneği devre dışıdır.

## 🔄 API Entegrasyonu

`API.fetchFirms()` kullanarak sunucudan firma listesini çeker.

```javascript
API.fetchFirms()
  .then(data => console.log(data))
  .catch(err => console.error(err))
```

## 📦 Build için Paket Haline Getirme

### Android APK:
```bash
cd mobile
eas build --platform android
```

### iOS IPA:
```bash
cd mobile
eas build --platform ios
```

## 🤝 Katkıda Bulunma

Sorun veya öneriniz mi var? Lütfen bildiriniz.

## 📄 Lisans

MIT
