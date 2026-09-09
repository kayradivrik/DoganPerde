"use client";
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

const MOCK_BLOGS = [
  {
    title: "2025'TE SOSYAL MEDYA PAZARLAMA TRENDLERİ",
    slug: "2025-sosyal-medya-pazarlama-trendleri",
    excerpt: "Sosyal medya pazarlaması, her geçen yıl kullanıcı davranışlarındaki değişim, teknolojik yenilikler ve algoritma güncellemeleriyle evrim geçirmeye devam ediyor.",
    content: "Sosyal medya reklamcılığı artık dijital pazarlamanın temel taşlarından biri. Facebook ve Instagram, Meta çatısı altında birleşmiş olsalar da reklam modelleri ve kullanıcı davranışları açısından hâlâ birbirinden farklı stratejiler gerektiriyor. Bu yazıda 2025 yılı itibarıyla sosyal medya kanallarındaki yeni trendleri ve markanız için nasıl kullanabileceğinizi inceliyoruz. \n\nÖzellikle yapay zeka destekli içerik üretimi, dikey video formatları (Reels, TikTok) ve mikro-toplulukların gücü 2025 pazarlama dünyasını domine etmeye devam ediyor. Markaların klasik statik gönderiler yerine kullanıcılarla doğrudan bağ kuran samimi video anlatılarına odaklanması gerekiyor.",
    imageUrl: "/images/insta1.png",
    category: "NEWS",
    createdAt: "2026-07-01T10:00:00Z"
  },
  {
    title: "SEO NEDİR? 2025 İÇİN ARAMA MOTORU OPTİMİZASYONU REHBERİ",
    slug: "seo-nedir-2025-arama-motoru-optimizasyonu-rehberi",
    excerpt: "Dijital dünyada başarılı olmak istiyorsanız, sadece bir web sitenizin olması yetmez. O sitenin Google'da görünür olması gerekir. Arama Motoru Optimizasyonu (SEO) detaylı rehberi.",
    content: "Dijital dünyada başarılı olmak istiyorsanız, sadece bir web sitenizin olması yetmez. O sitenin Google'da görünür olması, hatta ilk sayfada yer alması gerekir. İşte bu noktada devreye giren şey; SEO (Search Engine Optimization) yani Arama Motoru Optimizasyonu'dur. \n\nBu rehberde, SEO nedir, nasıl çalışır ve 2025'te dikkat etmeniz gereken güncel arama motoru optimizasyon stratejileri nelerdir sorularını detaylı şekilde ele alıyoruz.\n\n2025 SEO dünyasında, sadece anahtar kelime eşleştirmesi değil; kullanıcı deneyimi (UX), sayfa yüklenme hızları, mobil uyumluluk ve yapay zeka tabanlı Google arama algoritmalarına uyumluluk en kritik etkenlerdir. Web sitenizin hızı, temiz kod yapısı ve kullanıcıyı sitede tutan faydalı içerikler organik sıralamanızı doğrudan belirler.",
    imageUrl: "/images/insta2.png",
    category: "NEWS",
    createdAt: "2026-07-01T10:00:00Z"
  },
  {
    title: "FACEBOOK VE INSTAGRAM REKLAMLARI ARASINDAKİ FARK",
    slug: "facebook-ve-instagram-reklamları-arasındaki-fark",
    excerpt: "Sosyal medya reklamcılığı artık dijital pazarlamanın temel taşlarından biri. Facebook ve Instagram reklam modelleri ve kullanıcı davranışları arasındaki temel farklar.",
    content: "Sosyal medya reklamcılığı artık dijital pazarlamanın temel taşlarından biri. Facebook ve Instagram, Meta çatısı altında birleşmiş olsalar da, reklam modelleri ve kullanıcı davranışları açısından hâlâ birbirinden farklı stratejiler gerektiriyor. Bu yazıda 2025 yılı itibarıyla Facebook ve Instagram reklamları arasındaki farkları, hedef kitle davranışlarını ve bütçenizi en verimli şekilde nasıl yönetebileceğinizi inceliyoruz.\n\nFacebook daha çok bilgi odaklı, detaylı makale ve uzun soluklu video paylaşımlarına uygunken; Instagram tamamen görsel estetik, Reels videoları ve anlık hikayeler üzerinden satış odaklı kampanyalara hitap eder. Doğru kanalı seçmek bütçenizin geri dönüş oranını doğrudan etkiler.",
    imageUrl: "/images/insta3.png",
    category: "NEWS",
    createdAt: "2026-07-01T10:00:00Z"
  }
];

export default function BlogPostDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { slug } = params;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        const res = await fetch(`/api/blog/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
        } else {
          // Check mocks if API query fails or returned not found
          const mock = MOCK_BLOGS.find(p => p.slug === slug);
          setPost(mock);
        }
      } catch (err) {
        console.error('Fetch blog error, falling back to mocks:', err);
        const mock = MOCK_BLOGS.find(p => p.slug === slug);
        setPost(mock);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse flex flex-col gap-6">
        <div className="w-24 h-4 bg-slate-100 rounded-md" />
        <div className="w-full h-12 bg-slate-100 rounded-md" />
        <div className="w-1/3 h-4 bg-slate-100 rounded-md" />
        <div className="w-full h-[350px] bg-slate-100 rounded-[32px] mt-4" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center flex flex-col gap-4 items-center">
        <h1 className="text-3xl font-serif text-slate-900">Blog Yazısı Bulunamadı</h1>
        <p className="text-slate-500 text-xs font-semibold">Ulaşmaya çalıştığınız içerik mevcut değil.</p>
        <Link href="/blog" className="text-primary-500 font-bold hover:underline text-xs">Blog Sayfasına Dön</Link>
      </div>
    );
  }

  const formattedDate = post.createdAt 
    ? new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Haziran 2026';

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-8">
      
      {/* Back button matching Screenshot 2 */}
      <Link 
        href="/blog" 
        className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-slate-650 tracking-widest uppercase self-start group transition-colors"
      >
        <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to Blog</span>
      </Link>

      {/* Category and date matching Screenshot 2 */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-400">
          <span className="bg-red-650 text-white font-black px-2 py-0.5 rounded-sm tracking-widest text-[9px] uppercase">
            {post.category || 'NEWS'}
          </span>
          <span className="font-mono text-slate-350">|</span>
          <span className="tracking-wide uppercase font-semibold">{formattedDate}</span>
        </div>

        {/* Huge serif title matching Screenshot 2 */}
        <h1 className="text-3xl sm:text-5xl font-serif text-slate-950 font-normal leading-tight tracking-tight uppercase">
          {post.title}
        </h1>
      </div>

      {/* Featured centered image matching Screenshot 2 */}
      <div className="relative w-full h-[320px] sm:h-[450px] rounded-[32px] overflow-hidden shadow-lg bg-slate-50 border border-slate-100 mt-2">
        <Image
          src={post.imageUrl || '/images/insta1.png'}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Blog post content paragraphs matching Screenshot 2 */}
      <div className="text-slate-600 leading-relaxed text-sm font-medium flex flex-col gap-6 mt-6 max-w-3xl">
        {post.content.split('\n\n').map((para, idx) => (
          <p key={idx} className="first-of-type:text-base first-of-type:text-slate-800">
            {para}
          </p>
        ))}
      </div>

    </article>
  );
}
