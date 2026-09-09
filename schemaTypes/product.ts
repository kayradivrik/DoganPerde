export default {
  name: 'product',
  title: 'Ürünler',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Ürün Başlığı',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Açıklama',
      type: 'text',
    },
    {
      name: 'category',
      title: 'Kategori',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Ürün Görseli',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'priceInfo',
      title: 'Başlangıç Fiyat Bilgisi (örn: 600 TL/m²)',
      type: 'string',
    }
  ],
};
