"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const MOCK_BLOGS = [
  {
    id: 'mock-1',
    title: "2025'TE SOSYAL MEDYA PAZARLAMA TRENDLERİ",
    slug: "2025-sosyal-medya-pazarlama-trendleri",
    excerpt: "Sosyal medya pazarlaması, her geçen yıl kullanıcı davranışlarındaki değişim, teknolojik yenilikler ve algoritma güncellemeleriyle evrim geçirmeye devam ediyor.",
    imageUrl: "/images/insta1.png",
    category: "NEWS",
    createdAt: "2026-07-01T10:00:00Z"
  },
  {
    id: 'mock-2',
    title: "SEO NEDİR? 2025 İÇİN ARAMA MOTORU OPTİMİZASYONU...",
    slug: "seo-nedir-2025-arama-motoru-optimizasyonu-rehberi",
    excerpt: "Dijital dünyada başarılı olmak istiyorsanız, sadece bir web sitenizin olması yetmez. O sitenin Google'da görünür olması gerekir.",
    imageUrl: "/images/insta2.png",
    category: "NEWS",
    createdAt: "2026-07-01T10:00:00Z"
  },
  {
    id: 'mock-3',
    title: "FACEBOOK VE INSTAGRAM REKLAMLARI ARASINDAKİ...",
    slug: "facebook-ve-instagram-reklamları-arasındaki-fark",
    excerpt: "Sosyal medya reklamcılığı artık dijital pazarlamanın temel taşlarından biri. Facebook ve Instagram, Meta çatısı altında birleşmiş olsalar da...",
    imageUrl: "/images/insta3.png",
    category: "NEWS",
    createdAt: "2026-07-01T10:00:00Z"
  }
];

function BlogPageContent() {
  const [posts, setPosts] = useState(MOCK_BLOGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await fetch('/api/blog');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setPosts(data);
          }
        }
      } catch (err) {
        console.error('Failed to load blog posts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-12">
      
      {/* Title Header */}
      <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
        <span className="text-primary-500 font-extrabold uppercase tracking-wider text-xs">Atölye Günlüğü</span>
        <h1 className="text-4xl sm:text-6xl font-serif font-light text-slate-900 leading-tight">Blog & İçeriklerimiz</h1>
        <p className="text-slate-500 text-xs font-semibold">Tasarım trendleri, dekorasyon önerileri ve güncel haberleri okuyun.</p>
      </div>

      {/* Grid of posts matching the screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {posts.map((post) => (
          <Link
            key={post.id || post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col gap-5 hover:-translate-y-1 transition-transform duration-300"
          >
            {/* Pill-shaped Image exactly matching the Screenshot 1 */}
            <div className="relative aspect-square w-full rounded-[40px] overflow-hidden shadow-md bg-slate-50 border border-slate-100">
              <Image
                src={post.imageUrl || '/images/insta1.png'}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* NEWS badge on top-left of image */}
              <span className="absolute top-6 left-6 bg-white/95 text-slate-900 text-[10px] font-black tracking-widest uppercase py-1.5 px-4 rounded-full shadow-sm">
                {post.category || 'NEWS'}
              </span>

              {/* Dark circle indicator at bottom-right of image */}
              <div className="absolute bottom-6 right-6 w-9 h-9 rounded-full bg-black/85 flex items-center justify-center shadow-lg group-hover:bg-primary-500 group-hover:scale-110 transition-all duration-350 cursor-pointer">
                <span className="w-3.5 h-0.5 bg-white rounded-full" />
              </div>
            </div>

            {/* Typography underneath matching Screenshot 1 */}
            <div className="flex flex-col gap-2 px-1">
              <h3 className="font-serif font-bold text-slate-900 text-lg leading-snug group-hover:text-primary-600 transition-colors uppercase tracking-tight">
                {post.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-3">
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold tracking-wider text-slate-600">Blog Yükleniyor...</span>
        </div>
      </div>
    }>
      <BlogPageContent />
    </Suspense>
  );
}
