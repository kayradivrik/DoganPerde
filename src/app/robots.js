export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/studio/', '/api/'],
    },
    sitemap: 'https://doganperdecekmekoy.com/sitemap.xml',
  };
}
