import React from 'react'

export default function TermsPage() {
  return (
    <div className="container">
      <article className="purchase-card" style={{ maxWidth: '980px', margin: '0 auto' }}>
        <h2>Kullanım Şartları</h2>
        <p><strong>Yürürlük Tarihi:</strong> 23.02.2026</p>
        <p>
          Bu kullanım şartları, Taşımacılık Rehberi platformuna erişim sağlayan tüm kullanıcılar ve firma
          hesap sahipleri için geçerlidir. Platformu kullanan herkes aşağıdaki şartları kabul etmiş sayılır.
        </p>

        <h3>1) Hizmetin Kapsamı</h3>
        <p>
          Taşımacılık Rehberi; kullanıcılar ile taşımacılık firmalarını dijital ortamda buluşturan, rota,
          mesafe, fiyat ve iletişim süreçlerini kolaylaştıran bir platform sağlar.
        </p>

        <h3>2) Üyelik ve Hesap Güvenliği</h3>
        <ul>
          <li>Hesap oluştururken doğru ve güncel bilgi verilmesi zorunludur.</li>
          <li>Hesap bilgilerinin gizliliği ve güvenliğinden kullanıcı/firma sorumludur.</li>
          <li>Yetkisiz kullanım şüphesi halinde platforma derhal bildirim yapılmalıdır.</li>
        </ul>

        <h3>3) Kullanıcı ve Firma Yükümlülükleri</h3>
        <ul>
          <li>Mevzuata aykırı, yanıltıcı veya üçüncü kişilerin haklarını ihlal eden içerik paylaşılamaz.</li>
          <li>Mesajlaşma ve teklif süreçlerinde dürüstlük ve iyi niyet kurallarına uyulmalıdır.</li>
          <li>Platformun teknik işleyişini bozacak davranışlar (otomasyon, saldırı, kötüye kullanım) yasaktır.</li>
        </ul>

        <h3>4) Fiyatlandırma ve Satın Alma Süreci</h3>
        <p>
          Platformda yer alan fiyat, rota ve süre bilgileri ilgili firma verileri ve sistem hesaplamalarına
          dayanır. Nihai hizmet koşulları, kullanıcı ile firma arasındaki anlaşma ve yasal yükümlülükler
          çerçevesinde belirlenir.
        </p>

        <h3>5) İçerik ve Fikri Haklar</h3>
        <p>
          Platform arayüzü, marka unsurları, yazılım bileşenleri ve içerikler Taşımacılık Rehberi’ne veya
          ilgili hak sahiplerine aittir. İzinsiz çoğaltma, kopyalama veya ticari kullanım yapılamaz.
        </p>

        <h3>6) Sorumluluğun Sınırlandırılması</h3>
        <ul>
          <li>Platform, hizmet sağlayıcı firma ile kullanıcı arasındaki sözleşmenin doğrudan tarafı değildir.</li>
          <li>Teknik bakım, mücbir sebep veya üçüncü taraf kaynaklı kesintilerden doğan zararlarda sorumluluk sınırlıdır.</li>
          <li>Kullanıcıların beyan ettiği bilgilerin doğruluğu ilgili kullanıcı/firmanın sorumluluğundadır.</li>
        </ul>

        <h3>7) Askıya Alma ve Hesap Sonlandırma</h3>
        <p>
          Şartlara aykırı kullanım tespit edilmesi halinde hesaplar geçici veya kalıcı olarak askıya alınabilir,
          içerikler kaldırılabilir ve gerekli hallerde yasal süreçler başlatılabilir.
        </p>

        <h3>8) Değişiklik Hakkı</h3>
        <p>
          Taşımacılık Rehberi, kullanım şartlarını mevzuat veya hizmet ihtiyaçlarına göre güncelleme hakkını
          saklı tutar. Güncel metin platform üzerinde yayımlandığı tarihten itibaren geçerli olur.
        </p>

        <h3>9) İletişim</h3>
        <p>
          Kullanım şartlarıyla ilgili talepleriniz için destek@tasimacilikrehberi.com adresi üzerinden
          bizimle iletişime geçebilirsiniz.
        </p>
      </article>
    </div>
  )
}
