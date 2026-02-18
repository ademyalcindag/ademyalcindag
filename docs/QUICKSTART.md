# 🚀 Hızlı Başlangıç

## Web Uygulamasını Çalıştır

```bash
cd /workspaces/ademyalcindag
npm run dev
```

**Açılacak:** http://localhost:5173

---

## Mobile Uygulamasını Çalıştır

### 1. Expo Go İle Hızlı Test (En Kolay)

```bash
cd /workspaces/ademyalcindag/mobile
npm install
expo start
```

Telefonunuza **Expo Go** uygulamasını indirin ve QR kodunu tarayın.

---

### 2. Android Emülatörle Çalıştır

```bash
cd mobile
npm run android
```

---

### 3. iOS Simulator'le Çalıştır (Sadece Mac)

```bash
cd mobile
npm run ios
```

---

## 📱 Her İki Sürümde Ortak Özellikler

✅ Türkçe şehir/ilçe seçimi
✅ Dinamik fiyat formatlaması (45000 → 45.000 ₺)
✅ Gerçek zamanlı filtreleme
✅ Firma listeleme ve detayları

---

## 🔧 Sorun Giderme

### "Module not found" hatası?
```bash
cd mobile
rm -rf node_modules
npm install
```

### Expo QR kodu taranmıyor?
```bash
expo start --tunnel
```

### Port zaten kullanılıyor?
```bash
npm run dev -- --port 5174
```

---

## 📁 Dosya Yapısı

```
📦 ademyalcindag
 ├── 📂 src           → Web uygulaması
 ├── 📂 mobile        → Mobile uygulaması
 ├── 📂 server        → Backend
 ├── 📄 package.json  → Proje bağımlılıkları
 └── 📄 README.md     → Detaylı bilgi
```

---

**Başka soru mu? `MOBILE_README.md` dosyasını kontrol edin!**
