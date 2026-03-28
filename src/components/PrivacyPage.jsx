import React from 'react'

export default function PrivacyPage() {
  return (
    <div className="container">
      <article className="purchase-card" style={{ maxWidth: '980px', margin: '0 auto' }}>
        <h2>Gizlilik Politikası</h2>
        <p><strong>Yürürlük Tarihi:</strong> 23.02.2026</p>
        <p>
          Bu gizlilik politikası, Taşımacılık Rehberi platformunu kullanan kişilerin verilerinin nasıl
          toplandığını, kullanıldığını, saklandığını ve korunduğunu açıklamak amacıyla hazırlanmıştır.
        </p>

        <h3>1) Toplanan Bilgiler</h3>
        <ul>
          <li>Üyelik bilgileri (ad, e-posta, telefon, firma bilgileri)</li>
          <li>Hizmet işlem bilgileri (rota, mesafe, tarih/saat, fiyat, sipariş verileri)</li>
          <li>İletişim verileri (mesaj içerikleri, bildirim tercihleri)</li>
          <li>Teknik veriler (IP, oturum kayıtları, cihaz/tarayıcı bilgileri)</li>
          <li>Yüklenen medya dosyaları (firma fotoğrafları vb.)</li>
        </ul>

        <h3>2) Verilerin Kullanım Amaçları</h3>
        <ul>
          <li>Hesap yönetimi ve kimlik doğrulama süreçlerini yürütmek</li>
          <li>Taşımacılık hizmet süreçlerini ve teklif/satın alma akışını işletmek</li>
          <li>İletişim, destek ve kullanıcı memnuniyeti süreçlerini geliştirmek</li>
          <li>Hukuki yükümlülükleri yerine getirmek ve güvenliği sağlamak</li>
          <li>Platform performansını artırmak ve hataları analiz etmek</li>
        </ul>

        <h3>3) Çerez ve Benzeri Teknolojiler</h3>
        <p>
          Platform; oturum sürekliliği, güvenlik ve kullanıcı deneyimini iyileştirme amaçlarıyla çerezler
          ve benzeri teknolojiler kullanabilir. Tarayıcı ayarlarınızdan çerez tercihlerinizi yönetebilirsiniz.
        </p>
        <ul>
          <li>
            <strong>Zorunlu Çerezler:</strong> Giriş oturumu, güvenlik kontrolleri, sepet/satın alma adımları ve
            dolandırıcılık önleme gibi temel işlevler için kullanılır. Hizmetin çalışması için gereklidir.
          </li>
          <li>
            <strong>Analitik Çerezler (İsteğe Bağlı):</strong> Sayfa performansı, hata noktaları ve kullanıcı akışlarını
            anonim/özet seviyede ölçerek hizmet kalitesini artırmaya yardımcı olur.
          </li>
          <li>
            <strong>Pazarlama Çerezleri (İsteğe Bağlı):</strong> Kullanıcıya daha ilgili kampanya ve içerik gösterilmesi,
            reklam verimliliğinin ölçülmesi ve gereksiz bildirimlerin azaltılması için kullanılabilir.
          </li>
        </ul>
        <p>
          Platformda çerez tercihleri; “Sadece zorunlu”, “Tümünü kabul et” veya “Tercihleri özelleştir” seçenekleriyle
          yönetilebilir. İsteğe bağlı çerezler, açık rıza olmadan aktif edilmez.
        </p>

        <h3>4) Verilerin Saklanması ve Güvenliği</h3>
        <p>
          Kişisel veriler, işleme amacı için gerekli süre boyunca ve ilgili mevzuata uygun şekilde saklanır.
          Yetkisiz erişim, değiştirme ve ifşayı önlemek için makul teknik ve idari güvenlik önlemleri uygulanır.
        </p>

        <h3>5) Üçüncü Taraflarla Paylaşım</h3>
        <p>
          Verileriniz; mevzuat gereği yetkili kurumlarla, teknik altyapı sağlayıcılarıyla ve hizmetin
          sunulması için gerekli iş ortaklarıyla sınırlı ve ölçülü şekilde paylaşılabilir.
        </p>

        <h3>6) Kullanıcı Hakları</h3>
        <p>
          KVKK kapsamında kişisel verilerinize ilişkin erişim, düzeltme, silme, işleme itiraz ve diğer yasal
          haklarınızı kullanabilirsiniz. Başvurularınız makul süre içinde sonuçlandırılır.
        </p>

        <h3>7) Politika Değişiklikleri</h3>
        <p>
          Gizlilik politikası, yasal değişiklikler ve hizmet ihtiyaçlarına göre güncellenebilir. Güncel metin
          yayınlandığı tarihten itibaren geçerli kabul edilir.
        </p>

        <h3>8) İletişim</h3>
        <p>
          Gizlilik politikasıyla ilgili tüm sorularınız için destek@tasimacilikrehberi.com adresinden
          bizimle iletişime geçebilirsiniz.
        </p>
      </article>
    </div>
  )
}
