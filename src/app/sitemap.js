export default function sitemap() {
  const baseUrl = 'https://doganperdecekmekoy.com';
  
  const routes = [
    '',
    '/urunler',
    '/galeri',
    '/blog',
    '/hakkimizda',
    '/iletisim',
    '/teklif-al',
    '/kvkk',
    '/gizlilik-politikasi',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' || route === '/urunler' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/urunler' || route === '/teklif-al' ? 0.9 : 0.7,
  }));
}
