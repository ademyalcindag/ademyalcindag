# Google OAuth "origin_mismatch" Hatası - ÇÖZÜM ÇEKLİSTİ

## ⚠️ Sorun
```
Erişim engellendi: Yetkilendirme hatası
Error 400: origin_mismatch
```

---

## ✅ ÇÖZÜM - 3 Adım

### ADIM 1: Google Cloud Console'u Yapılan (5 dakika)

👉 https://console.cloud.google.com aç

**1.1) Projeyi Seç**
- Top right'ta: **Select a Project** → Projen seçin

**1.2) Credentials Git**
- Left sidebar: **APIs & Services** → **Credentials**

**1.3) OAuth Client ID'ni Aç**
- Listede "OAuth 2.0 Client ID" bul
- Adı: "Web client 1" (veya benzeri)
- **Tıkla** (modal açılacak)

**1.4) Authorized JavaScript Origins Ekle**
- **Production Domain:** Ekle
  ```
  https://www.tasimacilik-rehberi.com
  https://tasimacilik-rehberi.com
  ```

- **Development İçin:** (localhost testleri için)
  ```
  http://localhost:3001
  http://localhost:5173
  http://127.0.0.1:3001
  http://127.0.0.1:5173
  ```

**1.5) Save Et**
- Mavi **"Save"** butonuna tıkla

✅ BITTI!

---

### ADIM 2: Backend Environment'ını Yapılan (2 dakika)

**Hostinger / Production'da:**

SSH/cPanel'de:
```bash
cd public_html/tasimacilik  # Senin klasörün
nano .env
```

Şu parametreleri kontrol et:
```
NODE_ENV=production
GOOGLE_CLIENT_ID=703001786924-b09c4sm9kpsbpj8t9leallsunng4j9h1.apps.googleusercontent.com
CORS_ORIGINS=https://www.tasimacilik-rehberi.com,https://tasimacilik-rehberi.com
VITE_API_URL=https://www.tasimacilik-rehberi.com
```

Save: `Ctrl+X` → `Y` → `Enter`

---

### ADIM 3: Uygulamayı Yeniden Başlat (1 dakika)

```bash
npm run build:prod
npm run start:prod
```

Veya **Hostinger Panel** → **Node.js** → **Restart**

✅ BITTI!

---

## 🧪 Test Etme

1. Tarayıcıyı **tam yenile:** `Ctrl+Shift+Delete` (cache sil) + `F5`
2. Sitene git: https://www.tasimacilik-rehberi.com
3. **Auth** sayfasına git
4. **"Kullanıcı Girişi"** → **"Google ile Giriş Yap"**
5. Google popup açılmalı ve kayıt yapabilmelisin

---

## 🐛 Hala Çalışmıyor Mu?

### Sorunu Belirle:

**1️⃣ Google Popup Açılmıyor**
→ Console'da (F12 → Console) error var mı? Oku
→ Chrome DevTools → Network → /api/login-google çağrısını kontrol et

**2️⃣ "origin_mismatch" Hatası Alıyorsun**
→ Google Cloud Console'da domain ekledin mi?
→ `https://` ile ekledin mi? (http:// değil)
→ `www.` ile ve olmadan ikisini de ekledin mi?

**3️⃣ Backend Error "Invalid Client"**
→ GOOGLE_CLIENT_ID doğru mu?
→ Hostinger'da SSH'da `echo $GOOGLE_CLIENT_ID` çalıştır
→ Değeri kontrol et (703001786924-... ile başlamalı)

**4️⃣ CORS Hatası**
→ .env'de CORS_ORIGINS set mi?
→ Domain adı typo yok mu?

---

## 🆘 Eğer Yine Çalışmazsa

SSH'da log'u oku:
```bash
npm run start:prod 2>&1 | tee app.log
# İstersen 30 saniye sonra hataları görmek için: Ctrl+C
tail -f app.log
```

Hata mesajını bana gönder, beraber debug edelim!

---

## 📚 İlgili Dosyalar

- Setup kılavuzu: `docs/GOOGLE_OAUTH_SETUP.md`
- Deployment checklist: `docs/DEPLOYMENT.md`
- Environment template: `.env.example`
- Development template: `.env.local.example`
