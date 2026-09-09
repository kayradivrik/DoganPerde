export default {
  name: 'blogPost',
  title: 'Blog Yazıları',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Blog Başlığı',
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
      name: 'excerpt',
      title: 'Özet',
      type: 'text',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'content',
      title: 'İçerik',
      type: 'text',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Kapak Görseli',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'category',
      title: 'Kategori',
      type: 'string',
      initialValue: 'Dekorasyon',
    },
    {
      name: 'publishedAt',
      title: 'Yayınlanma Tarihi',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }
  ],
};
