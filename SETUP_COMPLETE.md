# ✅ Taşımacılık Rehberi - Web & Mobile Versiyonları Hazır!

## 📊 Hazırlanan İçerik

### 1️⃣ **Web Versiyonu** (Mevcut)
- React + Vite
- Responsive tasarım
- Tüm filtreler ve özellikler
- 📍 Konum: `/src` klasörü

### 2️⃣ **Mobile Versiyonu** (Yeni!)
- React Native + Expo
- Android & iPhone uyumlu
- Tüm web özelliklerini içerir
- 📍 Konum: `/mobile` klasörü

### 3️⃣ **Başlangıç Rehberleri** (Yeni!)
- `QUICKSTART.md` - Hızlı kurulum
- `MOBILE_README.md` - Detaylı bilgi
- `README.md` - Genel bilgiler

---

## 🎯 Özellikleri

### Filtreler
```
✅ Nereden (Kalkış Şehri)
✅ İlçe Seçimi
✅ Nereye (Varış Şehri)
✅ İlçe Seçimi
✅ Min/Max Fiyat (₺ formatında)
✅ Yük Durumu (Boş/Dolu)
✅ Arama Butonu
```

### Veri
```
✅ 81 Türkiye Şehri
✅ 8 şehrin ilçeleri
✅ Gerçek zamanlı filtreleme
✅ Autocomplete desteği
```

---

## 🚀 Çalıştırma Komutları

### Web:
```bash
cd /workspaces/ademyalcindag
npm run dev
```
👉 http://localhost:5173

### Mobile (Expo Go):
```bash
cd /workspaces/ademyalcindag/mobile
npm install
expo start
```
👉 QR kodu Expo Go ile tarayın

### Mobile (Android):
```bash
cd mobile
npm run android
```

### Mobile (iOS - Mac gerekli):
```bash
cd mobile
npm run ios
```

---

## 📱 Ekran Uyumluluğu

| Platform | Durum | Not |
|----------|-------|-----|
| Web | ✅ Ready | Vite dev sunucusu |
| Android | ✅ Ready | Expo/APK build |
| iPhone | ✅ Ready | Expo/IPA build |
| Tablet | ✅ Ready | Responsive |

---

## 🔗 Dosya Yapısı

```
ademyalcindag/
├── 📂 src/
│   ├── components/ (Home, Navbar, CompanyCard, vb.)
│   ├── App.jsx
│   ├── main.jsx
│   ├── data.js (API & şehirler)
│   └── styles.css
├── 📂 mobile/
│   ├── App.js (React Native)
│   ├── data.js (Shared API)
│   ├── app.json (Expo config)
│   └── package.json
├── 📂 server/
│   ├── index.js
│   └── backend.js
├── 📄 QUICKSTART.md (Hızlı başla!)
├── 📄 MOBILE_README.md (Detaylı rehber)
└── 📄 README.md (Genel bilgi)
```

---

## 🎨 UI/UX Tekrarlandı

✅ Aynı renkler (Mor #450ef3, Turuncu #f3450e)
✅ Aynı filtreler
✅ Aynı firma kartları
✅ Türkçe metin
✅ Fiyat formatlaması

---

## 🔄 API Entegrasyonu

Her iki sürüm de `data.js`'deki `API.fetchFirms()` kullanır:
- Web: `/src/data.js`
- Mobile: `/mobile/data.js` (kopyalı)

---

## 📦 Sonraki Adımlar (İsteğe Bağlı)

1. **Backend Bağlantısı**
   ```bash
   cd server
   npm install
   npm start
   ```

2. **APK/IPA Build**
   ```bash
   cd mobile
   eas build --platform android
   eas build --platform ios
   ```

3. **Production Deploy**
   - Web: Netlify/Vercel
   - Mobile: Google Play / App Store

---

## 💡 Kullanıcı Kılavuzu

### Web'de:
1. Filtreler sol panelde
2. Şehir yazıp seçin
3. Fiyat aralığı belirleyin
4. "Ara" butonuna tıklayın
5. Sonuçlar sağ tarafta

### Mobile'da:
1. Filtreler ekranın üstünde
2. Aynı seçenekler
3. Aynı sonuçlar
4. Dokunmatik input

---

## ✨ Tamamlandı!

Artık **Web, Android ve iPhone** versiyonlarınız hazır! 🎉

**Hızlı başlamak için:** `QUICKSTART.md` dosyasını okuyun!

---

*Son güncelleme: 13 Ocak 2026*
