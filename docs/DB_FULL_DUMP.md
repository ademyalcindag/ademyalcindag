# Veritabanı Tam Döküm (Masked)

- Oluşturulma zamanı: 2026-02-26 06:15:58
- Kök dizin: `/workspaces/ademyalcindag`

## db.sqlite

- Boyut: 0 bytes
- Durum: Boş dosya

## server.db

- Boyut: 90112 bytes
- Toplam tablo: 10

### Tablo: booking_orders

**Kolonlar**

- id (INTEGER)
- firmId (INTEGER)
- fromCity (TEXT)
- toCity (TEXT)
- moveDate (TEXT)
- amount (INTEGER)
- currency (TEXT)
- status (TEXT)
- cardHolder (TEXT)
- maskedCard (TEXT)
- createdAt (DATETIME)
- updatedAt (DATETIME)
- distanceKm (INTEGER)

**Toplam satır:** 11

**Veriler**

1. `{"id": 1, "firmId": 1, "fromCity": "İstanbul", "toCity": "Ankara", "moveDate": "2026-02-20", "amount": 22500, "currency": "TRY", "status": "pending_3d", "cardHolder": "Test User", "maskedCard": "**** **** **** 0000", "createdAt": "2026-02-20 05:55:44", "updatedAt": "2026-02-20 05:55:44", "distanceKm": 450}`
2. `{"id": 2, "firmId": 1, "fromCity": "İstanbul", "toCity": "Ankara", "moveDate": "2026-02-20", "amount": 6000, "currency": "TRY", "status": "paid", "cardHolder": "Test User", "maskedCard": "**** **** **** 0000", "createdAt": "2026-02-20 06:01:21", "updatedAt": "2026-02-20 06:01:33", "distanceKm": 120}`
3. `{"id": 3, "firmId": 3, "fromCity": "Ankara", "toCity": "Isparta", "moveDate": "2026-02-20", "amount": 18900, "currency": "TRY", "status": "paid", "cardHolder": "adem yalçındağ", "maskedCard": "**** **** **** 1569", "createdAt": "2026-02-20 06:07:42", "updatedAt": "2026-02-20 06:07:51", "distanceKm": 450}`
4. `{"id": 4, "firmId": 3, "fromCity": "İstanbul", "toCity": "İzmir", "moveDate": "2026-02-21", "amount": 16800, "currency": "TRY", "status": "pending_3d", "cardHolder": "Test User", "maskedCard": "**** **** **** 1111", "createdAt": "2026-02-20 06:27:38", "updatedAt": "2026-02-20 06:27:38", "distanceKm": 400}`
5. `{"id": 5, "firmId": 3, "fromCity": "İstanbul", "toCity": "İzmir", "moveDate": "2026-02-21", "amount": 16800, "currency": "TRY", "status": "pending_3d", "cardHolder": "Test User", "maskedCard": "**** **** **** 1111", "createdAt": "2026-02-20 06:27:48", "updatedAt": "2026-02-20 06:27:48", "distanceKm": 400}`
6. `{"id": 6, "firmId": 3, "fromCity": "İstanbul", "toCity": "İzmir", "moveDate": "2026-02-21", "amount": 16800, "currency": "TRY", "status": "paid", "cardHolder": "Test User", "maskedCard": "**** **** **** 1111", "createdAt": "2026-02-20 06:29:37", "updatedAt": "2026-02-20 06:31:04", "distanceKm": 400}`
7. `{"id": 7, "firmId": 3, "fromCity": "Şehitkamil", "toCity": "Onikişubat", "moveDate": "2026-02-20", "amount": 189000, "currency": "TRY", "status": "paid", "cardHolder": "adem yalçındağ", "maskedCard": "**** **** **** 2345", "createdAt": "2026-02-20 06:31:58", "updatedAt": "2026-02-20 06:32:03", "distanceKm": 4500}`
8. `{"id": 8, "firmId": 3, "fromCity": "Şehitkamil", "toCity": "Onikişubat", "moveDate": "2026-02-20", "amount": 189000, "currency": "TRY", "status": "pending_3d", "cardHolder": "ADEM YALÇINDAĞ", "maskedCard": "**** **** **** 4231", "createdAt": "2026-02-20 06:41:59", "updatedAt": "2026-02-20 06:41:59", "distanceKm": 4500}`
9. `{"id": 9, "firmId": 3, "fromCity": "Şehitkamil", "toCity": "Etimesgut", "moveDate": "2026-02-21", "amount": 30492, "currency": "TRY", "status": "paid", "cardHolder": "ADEM YALÇINDAĞ", "maskedCard": "**** **** **** 2165", "createdAt": "2026-02-20 07:29:15", "updatedAt": "2026-02-20 07:29:19", "distanceKm": 726}`
10. `{"id": 10, "firmId": 3, "fromCity": "Ankara", "toCity": "Gaziantep", "moveDate": "2026-02-23", "amount": 31500, "currency": "TRY", "status": "paid", "cardHolder": "ADEM YALÇINDAĞ", "maskedCard": "**** **** **** 6843", "createdAt": "2026-02-23 08:01:46", "updatedAt": "2026-02-23 08:01:55", "distanceKm": 750}`
11. `{"id": 11, "firmId": 3, "fromCity": "Amasya", "toCity": "Sakarya", "moveDate": "2026-02-25", "amount": 21000, "currency": "TRY", "status": "paid", "cardHolder": "SADDADSA", "maskedCard": "**** **** **** 1111", "createdAt": "2026-02-25 07:03:22", "updatedAt": "2026-02-25 07:03:30", "distanceKm": 500}`

### Tablo: bookings

**Kolonlar**

- id (INTEGER)
- firmId (INTEGER)
- userId (TEXT)
- fromCity (TEXT)
- toCity (TEXT)
- moveDate (DATETIME)
- items (TEXT)
- specialRequests (TEXT)
- status (TEXT)
- totalPrice (INTEGER)
- createdAt (DATETIME)
- updatedAt (DATETIME)

**Toplam satır:** 0

**Veriler**

- (kayıt yok)

### Tablo: campaigns

**Kolonlar**

- id (INTEGER)
- firmId (INTEGER)
- title (TEXT)
- description (TEXT)
- discount (REAL)
- startDate (DATETIME)
- endDate (DATETIME)
- createdAt (DATETIME)

**Toplam satır:** 2

**Veriler**

1. `{"id": 1, "firmId": 1, "title": "Yaz İndirimi %10", "description": "Haziran-Temmuz taşımalarda %10 indirim.", "discount": 10.0, "startDate": "2025-06-01", "endDate": "2025-07-31", "createdAt": "2025-12-22 07:34:30"}`
2. `{"id": 2, "firmId": 2, "title": "Hafta Sonu Kampanyası", "description": "Cumartesi taşımalarda ekstra ekip.", "discount": 15.0, "startDate": "2025-01-01", "endDate": "2025-12-31", "createdAt": "2025-12-22 07:34:30"}`

### Tablo: firms

**Kolonlar**

- id (INTEGER)
- name (TEXT)
- email (TEXT)
- taxNumber (TEXT)
- city (TEXT)
- address (TEXT)
- phone (TEXT)
- loadStatus (TEXT)
- price (INTEGER)
- distanceKm (INTEGER)
- rating (REAL)
- password (TEXT)
- description (TEXT)
- createdAt (DATETIME)
- updatedAt (DATETIME)
- district (TEXT)
- toCity (TEXT)
- toDistrict (TEXT)
- pricePerKm (INTEGER)
- verified (BOOLEAN)

**Toplam satır:** 5

**Veriler**

1. `{"id": 1, "name": "Metro Taşıma", "email": "***", "taxNumber": "1234567890", "city": "İstanbul", "address": "Kadıköy Mah. 15", "phone": "+90 532 000 0000", "loadStatus": "Boş", "price": 2500, "distanceKm": 400, "rating": 4.5, "password": "***", "description": "Doğrulama güncelleme testi", "createdAt": "2025-12-22 07:34:30", "updatedAt": "2026-02-18 17:11:19", "district": "Kadıköy", "toCity": "Ankara", "toDistrict": "Çankaya", "pricePerKm": 50, "verified": 0}`
2. `{"id": 2, "name": "Anadolu Nakliyat", "email": "***", "taxNumber": "9876543210", "city": "Ankara", "address": "Çankaya Cad. 7", "phone": "+90 532 111 1111", "loadStatus": "Dolu", "price": 3200, "distanceKm": 250, "rating": 4.2, "password": "***", "description": "Profesyonel taşıma ve depolama hizmetleri", "createdAt": "2025-12-22 07:34:30", "updatedAt": "2026-02-20 08:37:26", "district": "", "toCity": "", "toDistrict": "", "pricePerKm": 45, "verified": 0}`
3. `{"id": 3, "name": "Türkiye Geneli Express", "email": "***", "taxNumber": "5556667778", "city": "Tüm İller", "address": "Türkiye Geneli", "phone": "+90 532 222 2233", "loadStatus": "Boş", "price": 0, "distanceKm": 0, "rating": 4.9, "password": "***", "description": "Türkiye genelinde tüm il çiftleri arasında taşımacılık yapar.", "createdAt": "2026-02-20 06:05:03", "updatedAt": "2026-02-20 06:05:03", "district": null, "toCity": "Tüm İller", "toDistrict": null, "pricePerKm": 42, "verified": 1}`
4. `{"id": 4, "name": "admemmeda", "email": "***", "taxNumber": "10181290596", "city": "gaziantep", "address": "merveşehir 42 nolu sok", "phone": "5427146326", "loadStatus": "Boş", "price": "", "distanceKm": null, "rating": 4.0, "password": "***", "description": "tüm ülke genelinde şehirler arası taşımacılık yapan bir şirket oluşturduk ve bu firma evin içindeki paketleri evden alıp eve bırakma anına kadar herşeyi kendi sorumluluğu içindedir", "createdAt": "2026-02-20 08:46:25", "updatedAt": "2026-02-20 08:48:00", "district": "", "toCity": "gaziantep", "toDistrict": "", "pricePerKm": 70, "verified": 0}`
5. `{"id": 5, "name": "yazicii", "email": "***", "taxNumber": "123456789", "city": "ORDU", "address": "ORDU", "phone": "05310829138", "loadStatus": "Boş", "price": "", "distanceKm": null, "rating": 4.0, "password": "***", "description": "ORDU", "createdAt": "2026-02-25 07:04:30", "updatedAt": "2026-02-25 07:04:57", "district": "", "toCity": "ORDU", "toDistrict": "", "pricePerKm": 50, "verified": 0}`

### Tablo: messages

**Kolonlar**

- id (INTEGER)
- fromUser (TEXT)
- toFirm (INTEGER)
- content (TEXT)
- isRead (BOOLEAN)
- createdAt (DATETIME)
- firmId (INTEGER)
- senderId (INTEGER)
- senderName (TEXT)
- senderEmail (TEXT)
- message (TEXT)
- read (BOOLEAN)

**Toplam satır:** 6

**Veriler**

1. `{"id": 1, "fromUser": "Anonim", "toFirm": 1, "content": "adem yalçındağ", "isRead": 0, "createdAt": "2026-02-18 17:55:04", "firmId": 1, "senderId": null, "senderName": "Anonim", "senderEmail": "***", "message": "adem yalçındağ", "read": 0}`
2. `{"id": 2, "fromUser": "Anonim", "toFirm": 2, "content": "adem yalçınağ\n", "isRead": 0, "createdAt": "2026-02-18 18:09:15", "firmId": 2, "senderId": null, "senderName": "Anonim", "senderEmail": "***", "message": "adem yalçınağ\n", "read": 0}`
3. `{"id": 3, "fromUser": "Anonim", "toFirm": 1, "content": "sdgvsgd", "isRead": 0, "createdAt": "2026-02-18 18:09:44", "firmId": 1, "senderId": null, "senderName": "Anonim", "senderEmail": "***", "message": "sdgvsgd", "read": 0}`
4. `{"id": 4, "fromUser": "Anonim", "toFirm": 2, "content": "adsadasd", "isRead": 0, "createdAt": "2026-02-18 18:14:31", "firmId": 2, "senderId": null, "senderName": "Anonim", "senderEmail": "***", "message": "adsadasd", "read": 0}`
5. `{"id": 5, "fromUser": "Smoke qn5v5cxp", "toFirm": 1, "content": "Smoke test mesajı qn5v5cxp", "isRead": 0, "createdAt": "2026-02-18 18:52:21", "firmId": 1, "senderId": 7, "senderName": "Smoke qn5v5cxp", "senderEmail": "***", "message": "Smoke test mesajı qn5v5cxp", "read": 0}`
6. `{"id": 6, "fromUser": "Smoke brn4o52e", "toFirm": 1, "content": "Smoke test mesajı brn4o52e", "isRead": 0, "createdAt": "2026-02-18 18:54:00", "firmId": 1, "senderId": 8, "senderName": "Smoke brn4o52e", "senderEmail": "***", "message": "Smoke test mesajı brn4o52e", "read": 0}`

### Tablo: payment_transactions

**Kolonlar**

- id (INTEGER)
- bookingId (INTEGER)
- status (TEXT)
- threeDSCode (TEXT)
- threeDSVerifiedAt (DATETIME)
- createdAt (DATETIME)
- updatedAt (DATETIME)

**Toplam satır:** 11

**Veriler**

1. `{"id": 1, "bookingId": 1, "status": "pending_3d", "threeDSCode": "123456", "threeDSVerifiedAt": null, "createdAt": "2026-02-20 05:55:44", "updatedAt": "2026-02-20 05:55:44"}`
2. `{"id": 2, "bookingId": 2, "status": "paid", "threeDSCode": "123456", "threeDSVerifiedAt": "2026-02-20 06:01:33", "createdAt": "2026-02-20 06:01:21", "updatedAt": "2026-02-20 06:01:33"}`
3. `{"id": 3, "bookingId": 3, "status": "paid", "threeDSCode": "123456", "threeDSVerifiedAt": "2026-02-20 06:07:51", "createdAt": "2026-02-20 06:07:42", "updatedAt": "2026-02-20 06:07:51"}`
4. `{"id": 4, "bookingId": 4, "status": "pending_3d", "threeDSCode": "123456", "threeDSVerifiedAt": null, "createdAt": "2026-02-20 06:27:38", "updatedAt": "2026-02-20 06:27:38"}`
5. `{"id": 5, "bookingId": 5, "status": "pending_3d", "threeDSCode": "123456", "threeDSVerifiedAt": null, "createdAt": "2026-02-20 06:27:48", "updatedAt": "2026-02-20 06:27:48"}`
6. `{"id": 6, "bookingId": 6, "status": "paid", "threeDSCode": "123456", "threeDSVerifiedAt": "2026-02-20 06:31:04", "createdAt": "2026-02-20 06:29:37", "updatedAt": "2026-02-20 06:31:04"}`
7. `{"id": 7, "bookingId": 7, "status": "paid", "threeDSCode": "123456", "threeDSVerifiedAt": "2026-02-20 06:32:03", "createdAt": "2026-02-20 06:31:58", "updatedAt": "2026-02-20 06:32:03"}`
8. `{"id": 8, "bookingId": 8, "status": "pending_3d", "threeDSCode": "123456", "threeDSVerifiedAt": null, "createdAt": "2026-02-20 06:41:59", "updatedAt": "2026-02-20 06:41:59"}`
9. `{"id": 9, "bookingId": 9, "status": "paid", "threeDSCode": "123456", "threeDSVerifiedAt": "2026-02-20 07:29:19", "createdAt": "2026-02-20 07:29:15", "updatedAt": "2026-02-20 07:29:19"}`
10. `{"id": 10, "bookingId": 10, "status": "paid", "threeDSCode": "123456", "threeDSVerifiedAt": "2026-02-23 08:01:55", "createdAt": "2026-02-23 08:01:46", "updatedAt": "2026-02-23 08:01:55"}`
11. `{"id": 11, "bookingId": 11, "status": "paid", "threeDSCode": "123456", "threeDSVerifiedAt": "2026-02-25 07:03:30", "createdAt": "2026-02-25 07:03:22", "updatedAt": "2026-02-25 07:03:30"}`

### Tablo: photos

**Kolonlar**

- id (INTEGER)
- firmId (INTEGER)
- path (TEXT)
- uploadedAt (DATETIME)

**Toplam satır:** 4

**Veriler**

1. `{"id": 1, "firmId": 2, "path": "/uploads/57b6005de1ee5e63d857be536b84656c", "uploadedAt": "2026-02-18 18:13:12"}`
2. `{"id": 2, "firmId": 2, "path": "/uploads/489ce2bf9cc38cb1eeedabab7c746605", "uploadedAt": "2026-02-20 08:16:41"}`
3. `{"id": 3, "firmId": 2, "path": "/uploads/5be1344ab84356916fa32c74bc3782ba", "uploadedAt": "2026-02-20 08:16:48"}`
4. `{"id": 4, "firmId": 2, "path": "/uploads/f8a5f2fb52f2d7de62dceebb24bda30b", "uploadedAt": "2026-02-20 08:16:57"}`

### Tablo: prices

**Kolonlar**

- id (INTEGER)
- firmId (INTEGER)
- fromCity (TEXT)
- toCity (TEXT)
- price (INTEGER)
- estimatedHours (REAL)
- createdAt (DATETIME)

**Toplam satır:** 6

**Veriler**

1. `{"id": 1, "firmId": 1, "fromCity": "İstanbul", "toCity": "Ankara", "price": 2500, "estimatedHours": 12.0, "createdAt": "2025-12-22 07:34:30"}`
2. `{"id": 2, "firmId": 1, "fromCity": "İstanbul", "toCity": "İzmir", "price": 1800, "estimatedHours": 8.0, "createdAt": "2025-12-22 07:34:30"}`
3. `{"id": 3, "firmId": 2, "fromCity": "Ankara", "toCity": "İstanbul", "price": 2500, "estimatedHours": 12.0, "createdAt": "2025-12-22 07:34:30"}`
4. `{"id": 4, "firmId": 2, "fromCity": "Ankara", "toCity": "Gaziantep", "price": 3000, "estimatedHours": 14.0, "createdAt": "2025-12-22 07:34:30"}`
5. `{"id": 8, "firmId": 2, "fromCity": "Ankara", "toCity": "Eskişehir", "price": 1400, "estimatedHours": null, "createdAt": "2026-02-18 18:13:58"}`
6. `{"id": 9, "firmId": 5, "fromCity": "ORDU", "toCity": "ANKARA", "price": 200, "estimatedHours": null, "createdAt": "2026-02-25 07:06:50"}`

### Tablo: reviews

**Kolonlar**

- id (INTEGER)
- firmId (INTEGER)
- userId (TEXT)
- rating (REAL)
- comment (TEXT)
- createdAt (DATETIME)

**Toplam satır:** 0

**Veriler**

- (kayıt yok)

### Tablo: users

**Kolonlar**

- id (INTEGER)
- name (TEXT)
- email (TEXT)
- phone (TEXT)
- password (TEXT)
- type (TEXT)
- createdAt (DATETIME)
- updatedAt (DATETIME)

**Toplam satır:** 8

**Veriler**

1. `{"id": 1, "name": "Test User", "email": "***", "phone": "+90 500 123 4567", "password": "***", "type": "user", "createdAt": "2025-12-22 07:34:30", "updatedAt": "2025-12-22 07:34:30"}`
2. `{"id": 2, "name": "Test User", "email": "***", "phone": "+905550001122", "password": "***", "type": "user", "createdAt": "2026-02-18 17:07:22", "updatedAt": "2026-02-18 17:07:22"}`
3. `{"id": 3, "name": "Verify User", "email": "***", "phone": "+905550009999", "password": "***", "type": "user", "createdAt": "2026-02-18 17:11:16", "updatedAt": "2026-02-18 17:11:16"}`
4. `{"id": 4, "name": "Verify User", "email": "***", "phone": "+905551434864", "password": "***", "type": "user", "createdAt": "2026-02-18 17:14:24", "updatedAt": "2026-02-18 17:14:24"}`
5. `{"id": 5, "name": "Verify User", "email": "***", "phone": "+905551434895", "password": "***", "type": "user", "createdAt": "2026-02-18 17:14:55", "updatedAt": "2026-02-18 17:14:55"}`
6. `{"id": 6, "name": "adem yalçındağ", "email": "***", "phone": "5427146326", "password": "***", "type": "user", "createdAt": "2026-02-18 17:56:04", "updatedAt": "2026-02-18 17:56:04"}`
7. `{"id": 7, "name": "Smoke qn5v5cxp", "email": "***", "phone": "+905553430957", "password": "***", "type": "user", "createdAt": "2026-02-18 18:52:21", "updatedAt": "2026-02-18 18:52:21"}`
8. `{"id": 8, "name": "Smoke brn4o52e", "email": "***", "phone": "+905555913554", "password": "***", "type": "user", "createdAt": "2026-02-18 18:54:00", "updatedAt": "2026-02-18 18:54:00"}`
