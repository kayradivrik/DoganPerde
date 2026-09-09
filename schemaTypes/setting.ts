export default {
  name: 'setting',
  title: 'Site Genel Ayarları',
  type: 'document',
  fields: [
    {
      name: 'siteName',
      title: 'Firma Adı',
      type: 'string',
    },
    {
      name: 'siteSlogan',
      title: 'Slogan / Açıklama',
      type: 'string',
    },
    {
      name: 'heroTitle',
      title: 'Ana Sayfa Başlığı (Hero Başlığı)',
      type: 'string',
      description: 'Örn: Evinizin Havasını Değiştiren Zarif Dokunuşlar.',
    },
    {
      name: 'heroImage',
      title: 'Ana Sayfa Arka Plan (Hero Görseli)',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'phone1',
      title: 'Müşteri Temsilcisi 1 (Telefon)',
      type: 'string',
    },
    {
      name: 'phone2',
      title: 'Müşteri Temsilcisi 2 (Telefon)',
      type: 'string',
    },
    {
      name: 'whatsapp',
      title: 'WhatsApp Numarası (örn: 905354857631)',
      type: 'string',
    },
    {
      name: 'email',
      title: 'E-posta Adresi',
      type: 'string',
    },
    {
      name: 'address',
      title: 'Fiziksel Adres',
      type: 'text',
    },
    {
      name: 'mapsLink',
      title: 'Google Haritalar Bağlantısı',
      type: 'string',
    },
    {
      name: 'instagram',
      title: 'Instagram Profili (örn: https://instagram.com/...)',
      type: 'string',
    },
    {
      name: 'facebook',
      title: 'Facebook Sayfası',
      type: 'string',
    },
    {
      name: 'workWeekday',
      title: 'Hafta İçi Çalışma Saatleri',
      type: 'string',
    },
    {
      name: 'workSunday',
      title: 'Pazar Günü Çalışma Durumu',
      type: 'string',
    },
    // Hakkımızda (About) Sayfası Ayarları
    {
      name: 'aboutTitle',
      title: 'Hakkımızda Başlığı',
      type: 'string',
      description: 'Zanaatın ve Güvenin Hikayesi vb.',
    },
    {
      name: 'aboutSubtitle',
      title: 'Hakkımızda Slogan / Alt Başlığı',
      type: 'string',
    },
    {
      name: 'aboutContent',
      title: 'Hakkımızda Hikaye Metni',
      type: 'text',
      description: 'Atölyenizin hikayesini ve ustalık detaylarını buraya yazın.',
    },
    {
      name: 'aboutImage',
      title: 'Hakkımızda Resmi',
      type: 'image',
      options: { hotspot: true },
    },
    // Öncesi / Sonrası Kaydırıcı Resimleri
    {
      name: 'beforeImage',
      title: 'Öncesi - Kapalı Perde Resmi',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'afterImage',
      title: 'Sonrası - Açık Perde Resmi',
      type: 'image',
      options: { hotspot: true },
    },
    // Hizmet Bölgeleri (Footer İçin)
    {
      name: 'regions',
      title: 'Hizmet Bölgelerimiz (Virgülle Ayırın)',
      type: 'string',
      description: 'Footerda gösterilecek hizmet bölgeleri. Örn: Çekmeköy, Sancaktepe, Ümraniye',
    },
    // Dinamik Menü Linkleri (Navbar)
    {
      name: 'navLinks',
      title: 'Menü Linkleri (Navbar)',
      type: 'array',
      description: 'Navbarda ve mobil menüde gösterilecek yönlendirme linkleri.',
      of: [
        {
          type: 'object',
          name: 'navLink',
          title: 'Bağlantı',
          fields: [
            { name: 'name', title: 'Görünür Başlık (örn: HİZMETLERİMİZ)', type: 'string' },
            { name: 'href', title: 'Link Adresi (örn: /hizmetler veya https://...)', type: 'string' }
          ]
        }
      ]
    }
  ],
};
