export default {
  name: 'testimonial',
  title: 'Müşteri Yorumları',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Müşteri Adı',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'role',
      title: 'Ünvan / Rol',
      type: 'string',
      initialValue: 'Müşteri',
    },
    {
      name: 'stars',
      title: 'Yıldız Sayısı (1-5)',
      type: 'number',
      initialValue: 5,
      validation: (Rule: any) => Rule.min(1).max(5),
    },
    {
      name: 'text',
      title: 'Yorum Metni',
      type: 'text',
      validation: (Rule: any) => Rule.required(),
    }
  ],
};
