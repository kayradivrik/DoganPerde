export default {
  name: 'heroSlide',
  title: 'Anasayfa Slaytları',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Slayt Başlığı',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Alt Başlık / Kategori',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Açıklama',
      type: 'text',
    },
    {
      name: 'image',
      title: 'Slayt Arka Plan Görseli',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'order',
      title: 'Görüntülenme Sırası',
      type: 'number',
      initialValue: 0,
    }
  ],
};
