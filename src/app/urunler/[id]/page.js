"use client";
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Ruler, MessageSquare, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';

const MOCK_PRODUCTS = [
  {
    id: 'user-uploaded-1',
    title: 'Cam Balkon Plise Perde',
    category: 'Stor Perde',
    imageUrl: '/images/media__1785224299998.png',
    description: 'Cam balkonlar için özel tasarlanmış, kolay katlanır pratik plise perde. Toz ve kir tutmayan yapısı ile uzun yıllar lekesiz kullanım imkanı sunar.'
  },
  {
    id: 'user-uploaded-2',
    title: 'Premium Gri Fon Perde',
    category: 'Fon Perde',
    imageUrl: '/images/media__1785224308267.png',
    description: 'Kusursuz dökümü ve modern gri tonuyla salonlarınızı tamamlayan şık fon perde. Ağır kumaş dokusu ile zengin ve premium duruş sergiler.'
  },
  {
    id: 'user-uploaded-3',
    title: 'Keten Bej Fon Perde',
    category: 'Fon Perde',
    imageUrl: '/images/media__1785224311179.png',
    description: 'Doğal dokusu ve sıcak bej rengiyle evinizi ferahlatan keten perde. Işığı ideal oranda geçirerek yaşam alanına aydınlık kazandırır.'
  },
  {
    id: 'user-uploaded-4',
    title: 'Klasik Desenli Kahve Fon Perde',
    category: 'Fon Perde',
    imageUrl: '/images/media__1785224313426.png',
    description: 'Zarif dikey pilileri ve asil kahverengi detayları ile oturma odaları için ideal tasarım. Mekana retro ve şık bir esinti kazandırır.'
  },
  { id: 'mock-1', title: 'Lüks Vual Tül Perde', category: 'Tül Perde', imageUrl: '/images/insta1.png', description: 'İpeksi yumuşak doku and dökümlü görünüm sunan lüks salon tül modeli. Güneş ışığını yumuşatarak filtreler ve evinizde aydınlık, ferah bir atmosfer yaratır. Yıkanabilir, ütü gerektirmeyen pratik yapıdadır.' },
  { id: 'mock-2', title: 'Zebra Stor Perde (Naturel)', category: 'Zebra Perde', imageUrl: '/images/insta2.png', description: 'Işık ve gölge ayarı yapabilen, modern çizgilerle üretilmiş çift kat stor perde. Hem tül hem de güneşlik görevini aynı anda üstlenir. Özel alüminyum kasa yapısı ve dayanıklı mekanizması sayesinde uzun yıllar sorunsuz kullanım sunar.' },
  { id: 'mock-3', title: 'Keten Fon Perde (Kiremit)', category: 'Fon Perde', imageUrl: '/images/insta3.png', description: 'Salonunuza sıcaklık katan, doğal liflerden dokunmuş şık fon perde. Dökümlü duruşu ve kiremit tonuyla odanıza estetik bir zenginlik katar. Kalın dokusu sayesinde kışın ısı yalıtımına da katkı sağlar.' },
  { id: 'mock-4', title: 'Kumandalı Motorlu Stor', category: 'Akıllı Perde', imageUrl: '/images/insta3.png', description: 'Uzaktan kumandalı veya akıllı ev sistemine entegre edilebilen sessiz stor perde. Somfy/Becker motor altyapısı ile donatılmıştır. Telefonunuzdan veya sesli komutla perdenizi istediğiniz seviyeye getirebilirsiniz.' },
  { id: 'mock-5', title: 'Dantelli Klasik Tül', category: 'Tül Perde', imageUrl: '/images/insta2.png', description: 'Geleneksel motifleri modern dokunuşla birleştiren fransız dantelli tül modeli. Etek ucu dantel işlemeleri ile klasik tarzı benimseyen salonlar için mükemmel bir seçimdir.' },
  { id: 'mock-6', title: 'Kadife Fon Perde (Gece Mavisi)', category: 'Fon Perde', imageUrl: '/images/insta1.png', description: 'Lüks ve ağır görünüm sevenler için kalın kadife dökümlü fon perde. Işığı kesme özelliği yüksektir (karartma/blackout oranı %85). Yatak odaları ve sinema salonları için idealdir.' }
];

export default function ProductDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      if (id.startsWith('mock-')) {
        const mock = MOCK_PRODUCTS.find(p => p.id === id);
        setProduct(mock);
        setLoading(false);
      } else {
        try {
          const res = await fetch(`/api/products/${id}`);
          if (res.ok) {
            const data = await res.json();
            setProduct(data);
          } else {
            // If not found in DB, try searching mocks just in case
            const mock = MOCK_PRODUCTS.find(p => p.id === id);
            setProduct(mock);
          }
        } catch (err) {
          console.error('Fetch single product error:', err);
        } finally {
          setLoading(false);
        }
      }
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col gap-8 animate-pulse">
        <div className="w-20 h-6 bg-slate-100 rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="h-[400px] bg-slate-100 rounded-3xl" />
          <div className="flex flex-col gap-6">
            <div className="w-1/2 h-8 bg-slate-100 rounded-md" />
            <div className="w-1/4 h-6 bg-slate-100 rounded-md" />
            <div className="w-full h-24 bg-slate-100 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center flex flex-col gap-4 items-center">
        <h1 className="text-2xl font-serif font-light text-slate-900">Model Bulunamadı</h1>
        <p className="text-slate-550 text-xs font-semibold">İstediğiniz perde modeli mevcut katalogda bulunmuyor.</p>
        <Link href="/urunler" className="text-primary-500 font-bold hover:underline text-xs">Galeriye Geri Dön</Link>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(`Merhaba, Doğan Perde sitesindeki "${product.title}" (${product.category}) perde modeliniz hakkında bilgi almak ve ölçü randevusu talep etmek istiyorum.`);
  const whatsappUrl = `https://wa.me/905417310749?text=${whatsappMessage}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-8">
      
      {/* Back button */}
      <Link href="/urunler" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-primary-500 transition-colors group self-start">
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        <span>Tüm Modellere Dön</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Product Image (7 columns) */}
        <div className="lg:col-span-7 relative h-[450px] sm:h-[520px] w-full rounded-3xl overflow-hidden shadow-2xl bg-slate-50 border border-slate-100/50">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Right Side: Product Details (5 columns) */}
        <div className="lg:col-span-5 flex flex-col gap-7">
          <div className="flex flex-col gap-3">
            <span className="text-primary-500 font-extrabold text-[10px] uppercase tracking-widest bg-orange-50 self-start py-1 px-3.5 rounded-full border border-orange-100/30">
              {product.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-slate-900 leading-tight font-normal">
              {product.title}
            </h1>
          </div>

          <div className="border-t border-b border-slate-100 py-6 flex flex-col gap-3">
            <h3 className="font-serif font-bold text-slate-950 text-base">Model Açıklaması</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              {product.description}
            </p>
          </div>

          {/* Value props */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100">
            <div className="flex gap-2 items-center text-[11px] font-bold text-slate-600">
              <ShieldCheck className="text-emerald-500 shrink-0" size={15} />
              <span>Garantili Atölye Dikişi</span>
            </div>
            <div className="flex gap-2 items-center text-[11px] font-bold text-slate-600">
              <CheckCircle2 className="text-emerald-500 shrink-0" size={15} />
              <span>Hassas Ölçüye Özel</span>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link
              href={`/teklif-al?curtainType=${encodeURIComponent(product.category)}`}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white text-center font-bold py-4 rounded-2xl shadow-lg hover:shadow-primary-500/20 transition-all flex items-center justify-center gap-2 text-xs"
            >
              <Ruler size={16} />
              <span>Bu Model İçin Fiyat Hesapla</span>
            </Link>
            
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer text-xs"
            >
              <MessageSquare size={16} className="text-emerald-400" />
              <span>WhatsApp Bilgi</span>
            </a>
          </div>

          {/* Quick Support note */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5">
            <p className="text-[10px] text-slate-450 leading-relaxed font-medium">
              <strong>Müşteri Bilgilendirmesi:</strong> Doğan Perde kalitesiyle satın alacağınız her perde, kendi dikiş atölyemizde sizin pencerelerinize uygun olarak milimetrik üretilir. Kartelaları yerinde görmek ve ücretsiz keşif desteği almak için dilediğiniz zaman randevu oluşturabilirsiniz.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
