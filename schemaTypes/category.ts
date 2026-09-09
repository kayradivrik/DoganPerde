export default {
  name: 'category',
  title: 'Kategoriler',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Kategori Adı',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Kalıcı Bağlantı (Slug)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Kategori Kapak Görseli',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'priceInfo',
      title: 'Fiyat Bilgisi (örn: 600 TL/m²\'den Başlayan Fiyatlar)',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Kategori Açıklaması',
      type: 'text',
      description: 'Anasayfa sekmesinde gösterilecek kısa açıklama.',
    },
    {
      name: 'm2Price',
      title: 'Metrekare (m²) Birim Fiyatı (TL)',
      type: 'number',
      description: 'Ölçü fiyat hesaplamasında kullanılacak m² birim fiyatı. Örn: 600',
    },
    {
      name: 'minM2',
      title: 'Minimum Hesaplama Alanı (m²)',
      type: 'number',
      description: 'Hesaplamada baz alınacak minimum alan. Örn: 1.0 (Tüller) veya 1.5 (Storlar)',
      initialValue: 1.0,
    },
    {
      name: 'fixedFee',
      title: 'Sabit Mekanizma Bedeli (TL)',
      type: 'number',
      description: 'Metrekare fiyatına eklenecek sabit ücret (motor vb. için). Örn: 0 veya 1500',
      initialValue: 0,
    }
  ],
};
