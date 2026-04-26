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

## 5. Senin Yerine Dolduramadığım 1 Alan

Bunlar dış servis hesabı istediği için sadece sende olabilir:

1. `RESEND_API_KEY`

Bu değer olmadan canlı e-posta aktivasyonu çalışmaz.

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
4. Kayıt tamamlanıyor.
5. Hesabım ekranı açılıyor.
6. Mesajlaşma çalışıyor.
7. Haritadan rota seçimi çalışıyor.

## 8. En Kısa Gerçek Durum

Kod tarafında gereken hazırlık bitti.

Sadece şu 1 canlı servis bilgisini yerine koyman gerekiyor:

- Resend API key

Bunu verdiğin anda sistem canlı doğrulama ile çalışacak.