import React from 'react'

export default function KvkkPage() {
  return (
    <div className="container">
      <article className="purchase-card" style={{ maxWidth: '980px', margin: '0 auto' }}>
        <h2>KVKK Aydınlatma Metni</h2>
        <p><strong>Yürürlük Tarihi:</strong> 23.02.2026</p>
        <p>
          Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında,
          Taşımacılık Rehberi platformunu kullanan kullanıcı ve firma hesap sahiplerinin kişisel verilerinin
          işlenmesine ilişkin bilgilendirme amacıyla hazırlanmıştır.
        </p>

        <h3>1) Veri Sorumlusu</h3>
        <p>
          KVKK uyarınca kişisel verileriniz, veri sorumlusu sıfatıyla Taşımacılık Rehberi tarafından aşağıda
          açıklanan kapsamda işlenebilecektir.
        </p>

        <h3>2) İşlenen Kişisel Veriler</h3>
        <p>Platform kullanımına göre aşağıdaki veri kategorileri işlenebilir:</p>
        <ul>
          <li>Kimlik ve iletişim bilgileri (ad-soyad, e-posta, telefon)</li>
          <li>Hesap ve doğrulama bilgileri (şifrelenmiş parola, oturum verileri, token bilgileri)</li>
          <li>Firma bilgileri (firma adı, vergi numarası, adres, şehir/ilçe bilgileri)</li>
          <li>İşlem ve hizmet verileri (rota, mesafe, fiyat, tarih/saat, sipariş ve mesaj içerikleri)</li>
          <li>Görsel veriler (platforma yüklenen fotoğraflar)</li>
          <li>İşlem güvenliği kayıtları (IP, log, hata kayıtları, cihaz/tarayıcı bilgileri)</li>
        </ul>

        <h3>3) Kişisel Verilerin İşlenme Amaçları</h3>
        <ul>
          <li>Üyelik oluşturma, kimlik doğrulama ve hesap yönetimi süreçlerini yürütmek</li>
          <li>Taşımacılık hizmet eşleştirmesi, teklifleme, satın alma ve operasyon süreçlerini yürütmek</li>
          <li>Kullanıcı ile firma arasında iletişim ve mesajlaşma süreçlerini sağlamak</li>
          <li>Hukuki yükümlülükleri yerine getirmek ve resmi talepleri karşılamak</li>
          <li>Bilgi güvenliği, dolandırıcılık önleme ve sistem iyileştirme faaliyetlerini yürütmek</li>
          <li>Hizmet kalitesini artırmak ve kullanıcı deneyimini geliştirmek</li>
        </ul>

        <h3>4) İşlemenin Hukuki Sebepleri</h3>
        <p>Kişisel verileriniz KVKK’nın 5. ve 6. maddelerinde belirtilen hukuki sebeplere dayanılarak işlenir:</p>
        <ul>
          <li>Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması</li>
          <li>Veri sorumlusunun hukuki yükümlülüğünü yerine getirmesi</li>
          <li>Bir hakkın tesisi, kullanılması veya korunması için veri işlemenin zorunlu olması</li>
          <li>Temel hak ve özgürlüklerinize zarar vermemek kaydıyla veri sorumlusunun meşru menfaati</li>
          <li>Gerekli hallerde açık rızanızın bulunması</li>
        </ul>

        <h3>5) Kişisel Verilerin Aktarılması</h3>
        <p>
          Kişisel verileriniz; hizmetin sağlanabilmesi amacıyla yetkili kamu kurum ve kuruluşlarına,
          teknik altyapı sağlayıcılarına, ödeme/operasyon süreçlerinde destek alınan iş ortaklarına,
          mevzuatın izin verdiği sınırlar dahilinde aktarılabilir.
        </p>

        <h3>6) Toplama Yöntemi</h3>
        <p>
          Kişisel verileriniz; web sitesi, mobil uygulama, iletişim formları, yüklenen belgeler/görseller,
          mesajlaşma ekranları, çerezler ve log kayıtları gibi dijital kanallar üzerinden otomatik veya
          kısmen otomatik yöntemlerle toplanabilmektedir.
        </p>

        <h3>7) Saklama Süresi ve İmha</h3>
        <p>
          Verileriniz, ilgili mevzuatta öngörülen veya işleme amacı için gerekli olan süre boyunca saklanır.
          Süre bitiminde veya işleme sebebi ortadan kalktığında veriler; silme, yok etme veya anonimleştirme
          yöntemleriyle imha edilir.
        </p>

        <h3>8) KVKK Kapsamındaki Haklarınız</h3>
        <p>KVKK’nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:</p>
        <ul>
          <li>Kişisel verinizin işlenip işlenmediğini öğrenme</li>
          <li>İşlenmişse buna ilişkin bilgi talep etme</li>
          <li>İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme</li>
          <li>Yurt içinde/yurt dışında aktarıldığı üçüncü kişileri bilme</li>
          <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
          <li>KVKK’ya uygun olarak silinmesini veya yok edilmesini isteme</li>
          <li>Düzeltme/silme/yok etme işlemlerinin aktarılan üçüncü kişilere bildirilmesini isteme</li>
          <li>Münhasıran otomatik sistemler ile analiz sonucu aleyhe bir sonucun ortaya çıkmasına itiraz etme</li>
          <li>Kanuna aykırı işleme nedeniyle zarara uğranması halinde tazminat talep etme</li>
        </ul>

        <h3>9) Başvuru ve İletişim</h3>
        <p>
          KVKK kapsamındaki taleplerinizi, kimliğinizi tevsik edici bilgilerle birlikte
          <strong> destek@tasimacilikrehberi.com </strong> adresine iletebilirsiniz. Başvurular,
          mevzuatta öngörülen süreler içinde değerlendirilip sonuçlandırılır.
        </p>

        <p className="purchase-status" style={{ marginTop: '14px' }}>
          Not: Bu metin genel bilgilendirme amacı taşır. Kuruma özgü hukuki uyumluluk için profesyonel hukuk
          danışmanlığı alınması önerilir.
        </p>
      </article>
    </div>
  )
}
