export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/studio/', '/api/'],
    },
    sitemap: 'https://doganperde.com/sitemap.xml',
  };
}
