# Veritabanı Raporu (Tam / Unmasked)

- Veritabanı: /workspaces/ademyalcindag/server.db
- Oluşturulma: 2026-02-26 06:29:17

## booking_orders

- Kayıt sayısı: 11

|id|firmId|fromCity|toCity|moveDate|amount|currency|status|cardHolder|maskedCard|createdAt|updatedAt|distanceKm|
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|1|1|İstanbul|Ankara|2026-02-20|22500|TRY|pending_3d|Test User|**** **** **** 0000|2026-02-20 05:55:44|2026-02-20 05:55:44|450|
|2|1|İstanbul|Ankara|2026-02-20|6000|TRY|paid|Test User|**** **** **** 0000|2026-02-20 06:01:21|2026-02-20 06:01:33|120|
|3|3|Ankara|Isparta|2026-02-20|18900|TRY|paid|adem yalçındağ|**** **** **** 1569|2026-02-20 06:07:42|2026-02-20 06:07:51|450|
|4|3|İstanbul|İzmir|2026-02-21|16800|TRY|pending_3d|Test User|**** **** **** 1111|2026-02-20 06:27:38|2026-02-20 06:27:38|400|
|5|3|İstanbul|İzmir|2026-02-21|16800|TRY|pending_3d|Test User|**** **** **** 1111|2026-02-20 06:27:48|2026-02-20 06:27:48|400|
|6|3|İstanbul|İzmir|2026-02-21|16800|TRY|paid|Test User|**** **** **** 1111|2026-02-20 06:29:37|2026-02-20 06:31:04|400|
|7|3|Şehitkamil|Onikişubat|2026-02-20|189000|TRY|paid|adem yalçındağ|**** **** **** 2345|2026-02-20 06:31:58|2026-02-20 06:32:03|4500|
|8|3|Şehitkamil|Onikişubat|2026-02-20|189000|TRY|pending_3d|ADEM YALÇINDAĞ|**** **** **** 4231|2026-02-20 06:41:59|2026-02-20 06:41:59|4500|
|9|3|Şehitkamil|Etimesgut|2026-02-21|30492|TRY|paid|ADEM YALÇINDAĞ|**** **** **** 2165|2026-02-20 07:29:15|2026-02-20 07:29:19|726|
|10|3|Ankara|Gaziantep|2026-02-23|31500|TRY|paid|ADEM YALÇINDAĞ|**** **** **** 6843|2026-02-23 08:01:46|2026-02-23 08:01:55|750|
|11|3|Amasya|Sakarya|2026-02-25|21000|TRY|paid|SADDADSA|**** **** **** 1111|2026-02-25 07:03:22|2026-02-25 07:03:30|500|

## bookings

- Kayıt sayısı: 0

|id|firmId|userId|fromCity|toCity|moveDate|items|specialRequests|status|totalPrice|createdAt|updatedAt|
|---|---|---|---|---|---|---|---|---|---|---|---|
|||||||||||||

## campaigns

- Kayıt sayısı: 2

|id|firmId|title|description|discount|startDate|endDate|createdAt|
|---|---|---|---|---|---|---|---|
|1|1|Yaz İndirimi %10|Haziran-Temmuz taşımalarda %10 indirim.|10.0|2025-06-01|2025-07-31|2025-12-22 07:34:30|
|2|2|Hafta Sonu Kampanyası|Cumartesi taşımalarda ekstra ekip.|15.0|2025-01-01|2025-12-31|2025-12-22 07:34:30|

## firms

- Kayıt sayısı: 5

|id|name|email|taxNumber|city|address|phone|loadStatus|price|distanceKm|rating|password|description|createdAt|updatedAt|district|toCity|toDistrict|pricePerKm|verified|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|1|Metro Taşıma|metro@tasima.com|1234567890|İstanbul|Kadıköy Mah. 15|+90 532 000 0000|Boş|2500|400|4.5|$2a$10$pR2ab7fjd.cTcm5FTy8W0.zjo7aBR6NiO7HZe3jHL7y4Bvfz18MHG|Doğrulama güncelleme testi|2025-12-22 07:34:30|2026-02-18 17:11:19|Kadıköy|Ankara|Çankaya|50|0|
|2|Anadolu Nakliyat|anadolu@nakliyat.com|9876543210|Ankara|Çankaya Cad. 7|+90 532 111 1111|Dolu|3200|250|4.2|$2a$10$pR2ab7fjd.cTcm5FTy8W0.zjo7aBR6NiO7HZe3jHL7y4Bvfz18MHG|Profesyonel taşıma ve depolama hizmetleri|2025-12-22 07:34:30|2026-02-20 08:37:26||||45|0|
|3|Türkiye Geneli Express|turkiyegeneli@nakliye.com|5556667778|Tüm İller|Türkiye Geneli|+90 532 222 2233|Boş|0|0|4.9|$2a$10$/q6jBVEt9G5KwkQPp0Ofo.JR8wZ6Co3dWnBi7dd/nESeGtHkMAKEK|Türkiye genelinde tüm il çiftleri arasında taşımacılık yapar.|2026-02-20 06:05:03|2026-02-20 06:05:03||Tüm İller||42|1|
|4|admemmeda|admylcndg1@gmail.com|10181290596|gaziantep|merveşehir 42 nolu sok|5427146326|Boş|||4.0|$2a$10$0VRPFtpW93WqlU1ng4DDaeYBieVRFr5DAlu96/6vVqwhl2qNwpQWG|tüm ülke genelinde şehirler arası taşımacılık yapan bir şirket oluşturduk ve bu firma evin içindeki paketleri evden alıp eve bırakma anına kadar herşeyi kendi sorumluluğu içindedir|2026-02-20 08:46:25|2026-02-20 08:48:00||gaziantep||70|0|
|5|yazicii|taner_yazicii@hotmail.com|123456789|ORDU|ORDU|05310829138|Boş|||4.0|$2a$10$2dhJEpfPeTYYm88wYNeNlu7ohJlEvJ9qJL.OULEd9CYqaQdhwBnni|ORDU|2026-02-25 07:04:30|2026-02-25 07:04:57||ORDU||50|0|

## messages

- Kayıt sayısı: 6

|id|fromUser|toFirm|content|isRead|createdAt|firmId|senderId|senderName|senderEmail|message|read|
|---|---|---|---|---|---|---|---|---|---|---|---|
|1|Anonim|1|adem yalçındağ|0|2026-02-18 17:55:04|1||Anonim|unknown@example.com|adem yalçındağ|0|
|2|Anonim|2|adem yalçınağ |0|2026-02-18 18:09:15|2||Anonim|unknown@example.com|adem yalçınağ |0|
|3|Anonim|1|sdgvsgd|0|2026-02-18 18:09:44|1||Anonim|unknown@example.com|sdgvsgd|0|
|4|Anonim|2|adsadasd|0|2026-02-18 18:14:31|2||Anonim|unknown@example.com|adsadasd|0|
|5|Smoke qn5v5cxp|1|Smoke test mesajı qn5v5cxp|0|2026-02-18 18:52:21|1|7|Smoke qn5v5cxp|smoke_qn5v5cxp@mail.com|Smoke test mesajı qn5v5cxp|0|
|6|Smoke brn4o52e|1|Smoke test mesajı brn4o52e|0|2026-02-18 18:54:00|1|8|Smoke brn4o52e|smoke_brn4o52e@mail.com|Smoke test mesajı brn4o52e|0|

## payment_transactions

- Kayıt sayısı: 11

|id|bookingId|status|threeDSCode|threeDSVerifiedAt|createdAt|updatedAt|
|---|---|---|---|---|---|---|
|1|1|pending_3d|123456||2026-02-20 05:55:44|2026-02-20 05:55:44|
|2|2|paid|123456|2026-02-20 06:01:33|2026-02-20 06:01:21|2026-02-20 06:01:33|
|3|3|paid|123456|2026-02-20 06:07:51|2026-02-20 06:07:42|2026-02-20 06:07:51|
|4|4|pending_3d|123456||2026-02-20 06:27:38|2026-02-20 06:27:38|
|5|5|pending_3d|123456||2026-02-20 06:27:48|2026-02-20 06:27:48|
|6|6|paid|123456|2026-02-20 06:31:04|2026-02-20 06:29:37|2026-02-20 06:31:04|
|7|7|paid|123456|2026-02-20 06:32:03|2026-02-20 06:31:58|2026-02-20 06:32:03|
|8|8|pending_3d|123456||2026-02-20 06:41:59|2026-02-20 06:41:59|
|9|9|paid|123456|2026-02-20 07:29:19|2026-02-20 07:29:15|2026-02-20 07:29:19|
|10|10|paid|123456|2026-02-23 08:01:55|2026-02-23 08:01:46|2026-02-23 08:01:55|
|11|11|paid|123456|2026-02-25 07:03:30|2026-02-25 07:03:22|2026-02-25 07:03:30|

## photos

- Kayıt sayısı: 4

|id|firmId|path|uploadedAt|
|---|---|---|---|
|1|2|/uploads/57b6005de1ee5e63d857be536b84656c|2026-02-18 18:13:12|
|2|2|/uploads/489ce2bf9cc38cb1eeedabab7c746605|2026-02-20 08:16:41|
|3|2|/uploads/5be1344ab84356916fa32c74bc3782ba|2026-02-20 08:16:48|
|4|2|/uploads/f8a5f2fb52f2d7de62dceebb24bda30b|2026-02-20 08:16:57|

## prices

- Kayıt sayısı: 6

|id|firmId|fromCity|toCity|price|estimatedHours|createdAt|
|---|---|---|---|---|---|---|
|1|1|İstanbul|Ankara|2500|12.0|2025-12-22 07:34:30|
|2|1|İstanbul|İzmir|1800|8.0|2025-12-22 07:34:30|
|3|2|Ankara|İstanbul|2500|12.0|2025-12-22 07:34:30|
|4|2|Ankara|Gaziantep|3000|14.0|2025-12-22 07:34:30|
|8|2|Ankara|Eskişehir|1400||2026-02-18 18:13:58|
|9|5|ORDU|ANKARA|200||2026-02-25 07:06:50|

## reviews

- Kayıt sayısı: 0

|id|firmId|userId|rating|comment|createdAt|
|---|---|---|---|---|---|
|||||||

## users

- Kayıt sayısı: 8

|id|name|email|phone|password|type|createdAt|updatedAt|
|---|---|---|---|---|---|---|---|
|1|Test User|user@example.com|+90 500 123 4567|$2a$10$zbH5r9T73jOU0cUqGhT.9uNqsMSG9Olz1j1ps3wXzbLrpGO6rKOrW|user|2025-12-22 07:34:30|2025-12-22 07:34:30|
|2|Test User|test1771434442@example.com|+905550001122|$2a$10$qUxdXXvU2msm4Rbt8qJrBegVtfg7VTVbnKKl8u53/yFqlULE./Kua|user|2026-02-18 17:07:22|2026-02-18 17:07:22|
|3|Verify User|verify1771434676@example.com|+905550009999|$2a$10$Hjqn1IeYGltnAP4HRjE2A.GnccJMyC5kgplNuk7jmIBjfNtC8xgPe|user|2026-02-18 17:11:16|2026-02-18 17:11:16|
|4|Verify User|verify1771434864@example.com|+905551434864|$2a$10$55ww8Mgh2jfYNTVugv7ZkOTXN/woP35F4j2/1OZczoRZ8MaFJk/NS|user|2026-02-18 17:14:24|2026-02-18 17:14:24|
|5|Verify User|verify1771434895@example.com|+905551434895|$2a$10$iBmHARaxRBzz53xeDx5wx.74P2mlUpdvAOWqdLSMqUr4v/07o48Xe|user|2026-02-18 17:14:55|2026-02-18 17:14:55|
|6|adem yalçındağ|ademyalcindag@gmail.com|5427146326|$2a$10$ltiBLUrjE2i.FeHUczsezusQL2Y10/l3fHkiTBO/WoUvVb5EMaSTm|user|2026-02-18 17:56:04|2026-02-18 17:56:04|
|7|Smoke qn5v5cxp|smoke_qn5v5cxp@mail.com|+905553430957|$2a$10$8fZrsMIQWt2ylPmDo3x4YujSaKpu5UlDyPCdXhRhpIJ5O7uEp6Rwa|user|2026-02-18 18:52:21|2026-02-18 18:52:21|
|8|Smoke brn4o52e|smoke_brn4o52e@mail.com|+905555913554|$2a$10$E0ShyMrD7CJudu2AOJ33wOqN1GFPue8TzVD3lSqMCYx0HR7rjTVQC|user|2026-02-18 18:54:00|2026-02-18 18:54:00|
