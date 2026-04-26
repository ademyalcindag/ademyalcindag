# Hostinger Kurulum - Teknik Olmayan Kısa Sürüm

Bu dosya sadece yapıştır ve çalıştır mantığıyla hazırlandı.

## 1. GitHub

Hostinger'a bağlayacağın repo:

```text
https://github.com/ademyalcindag/ademyalcindag
```

Branch:

```text
main
```

## 2. Hostinger Node.js Alanları

Şunları aynen gir:

- Node.js version: `20+`
- Application root: `/`
- Startup file: `server/server.js`
- PM2: `Açık`

## 3. Build ve Start Komutları

Build command:

```text
npm run build:prod
```

Start command:

```text
npm run start:prod
```

## 4. Environment Variables

Bu dosyadaki değerleri kullan:

- [docs/HOSTINGER_ENV_READY.txt](docs/HOSTINGER_ENV_READY.txt)

Buradaki satırları Hostinger panelindeki Environment Variables bölümüne tek tek ekle.

## 5. Senin Yerine Dolduramadığım 4 Alan

Bunlar dış servis hesabı istediği için sadece sende olabilir:

1. `TWILIO_ACCOUNT_SID`
2. `TWILIO_AUTH_TOKEN`
3. `TWILIO_FROM_NUMBER`
4. `RESEND_API_KEY`

Bu 4 değer olmadan canlı SMS ve canlı e-posta çalışmaz.

## 6. Google Tarafında Olması Gerekenler

Google Cloud Console içine bunları ekle:

```text
https://www.tasimacilikrehberi.com
https://tasimacilikrehberi.com
```

## 7. Deploy Sonrası Kontrol

Şunları test et:

1. Kişi hesabı kayıt ekranı açılıyor.
2. Google ile kayıt butonu görünüyor.
3. E-posta aktivasyon maili geliyor.
4. SMS kodu geliyor.
5. Kayıt tamamlanıyor.
6. Hesabım ekranı açılıyor.
7. Mesajlaşma çalışıyor.
8. Haritadan rota seçimi çalışıyor.

## 8. En Kısa Gerçek Durum

Kod tarafında gereken hazırlık bitti.

Sadece şu 4 canlı servis bilgisini yerine koyman gerekiyor:

- Twilio SID
- Twilio token
- Twilio gönderici numarası
- Resend API key

Bunları verdiğin anda sistem canlı doğrulama ile çalışacak.