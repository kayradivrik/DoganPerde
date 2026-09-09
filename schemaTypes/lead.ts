export default {
  name: 'lead',
  title: 'Müşteri Talepleri',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Ad Soyad',
      type: 'string',
    },
    {
      name: 'phone',
      title: 'Telefon Numarası',
      type: 'string',
    },
    {
      name: 'address',
      title: 'Adres',
      type: 'text',
    },
    {
      name: 'curtainType',
      title: 'Perde Türü',
      type: 'string',
    },
    {
      name: 'message',
      title: 'Müşteri Notu',
      type: 'text',
    },
    {
      name: 'leadType',
      title: 'Talep Türü',
      type: 'string',
      options: {
        list: [
          { title: 'Keşif Randevusu', value: 'APPOINTMENT' },
          { title: 'Fiyat Hesaplama', value: 'CALCULATOR' },
        ],
      },
    },
    {
      name: 'status',
      title: 'İşlem Durumu',
      type: 'string',
      options: {
        list: [
          { title: 'Bekliyor', value: 'PENDING' },
          { title: 'Arandı', value: 'CONTACTED' },
          { title: 'Tamamlandı', value: 'COMPLETED' },
          { title: 'İptal Edildi', value: 'CANCELLED' },
        ],
      },
      initialValue: 'PENDING',
    },
    {
      name: 'width',
      title: 'Genişlik (cm)',
      type: 'number',
    },
    {
      name: 'height',
      title: 'Yükseklik (cm)',
      type: 'number',
    },
    {
      name: 'estimatedPrice',
      title: 'Tahmini Fiyat (TL)',
      type: 'number',
    },
  ],
};
