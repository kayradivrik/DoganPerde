export default {
  name: 'galleryItem',
  title: 'Galeri Fotoğrafları',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Görsel Başlığı / Açıklama',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Galeri Görseli',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Kategori (Örn: Tül, Stor, Jaluzi)',
      type: 'string',
      options: {
        list: [
          { title: 'Tül Perde', value: 'tul' },
          { title: 'Stor Perde', value: 'stor' },
          { title: 'Jaluzi & Zebra', value: 'jaluzi' },
          { title: 'Fon Perde', value: 'fon' },
          { title: 'Diğer', value: 'diger' },
        ],
      },
    },
  ],
};
