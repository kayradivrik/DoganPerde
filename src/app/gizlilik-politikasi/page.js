"use client";
import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      
      {/* Back button */}
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary-500 transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        <span>Anasayfa'ya Dön</span>
      </Link>

      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-primary-500 flex items-center justify-center shrink-0">
            <Shield size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Yasal Bilgilendirme</span>
            <h1 className="text-2xl sm:text-3xl font-serif text-slate-900 font-bold mt-0.5">Gizlilik Politikası</h1>
          </div>
        </div>

        {/* Content */}
        <div className="text-slate-650 text-sm leading-relaxed flex flex-col gap-6 font-medium">
          <p>
            <strong>Doğan Perde</strong> olarak, ziyaretçilerimizin gizliliğini korumayı ilke ediniyoruz. Bu gizlilik politikası, web sitemizi ziyaret ettiğinizde elde edilen kişisel bilgilerinizin nasıl toplandığını, kullanıldığını, saklandığını ve korunduğunu açıklamaktadır.
          </p>

          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 font-serif">1. Toplanan Bilgiler</h2>
            <p>Web sitemizi ziyaret ettiğinizde veya iletişim formlarımızı doldurduğunuzda sizden şu bilgileri toplayabiliriz:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              <li>İsim, soyisim</li>
              <li>Telefon numarası</li>
              <li>Adres bilgisi (sipariş durumunda)</li>
              <li>IP adresi ve çerez verileri (ziyaret deneyimini iyileştirmek amacıyla)</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 font-serif">2. Bilgiler Nasıl Kullanılır?</h2>
            <p>Toplanan kişisel veriler şu amaçlarla kullanılabilir:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              <li>Size daha iyi hizmet sunmak</li>
              <li>Siparişlerinizi işlemek ve teslim etmek</li>
              <li>Müşteri taleplerine ve sorularına yanıt vermek</li>
              <li>Ürün ve kampanyalar hakkında bilgilendirme yapmak (açık rıza alınması halinde)</li>
              <li>Web sitesinin kullanım deneyimini geliştirmek</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 font-serif">3. Verilerin Güvenliği</h2>
            <p>
              Doğan Perde olarak, kişisel verilerinizin gizliliğini ve bütünlüğünü korumayı amaçlayan teknik ve idari güvenlik önlemleri almaktayız. Verileriniz, yetkisiz erişimlere karşı korunmakta ve yalnızca gerekli durumlarda yetkili kişilerle paylaşılmaktadır.
            </p>
          </div>

          <div className="flex flex-col gap-3 bg-orange-50/60 p-5 rounded-2xl border border-orange-100/80">
            <h2 className="text-base font-bold text-slate-900 font-serif">Gizlilik ve Çerez Politikası</h2>
            <p className="text-slate-700 font-medium">
              Doğan Perde olarak, web sitemizin temel fonksiyonlarını çalıştırmak ve kullanım deneyiminizi iyileştirmek amacıyla yalnızca zorunlu teknik çerezler (cookies) kullanılmaktadır. Sitemizde kullanıcı takibi yapan veya kişisel verilerinizi reklam verenlerle paylaşan üçüncü taraf pazarlama çerezleri kullanılmamaktadır. Sitemizi kullanmaya devam ederek bu teknik çerezlerin kullanımını kabul etmiş olursunuz.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 font-serif">5. Üçüncü Taraf Bağlantıları</h2>
            <p>
              Web sitemiz, farklı sitelere yönlendiren bağlantılar içerebilir. Bu sitelerin gizlilik uygulamalarından Doğan Perde sorumlu değildir. Bu nedenle, bağlantı verdiğimiz web sitelerinin gizlilik politikalarını incelemenizi tavsiye ederiz.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 font-serif">6. Kullanıcı Hakları</h2>
            <p>Kişisel verileriniz üzerinde aşağıdaki haklara sahipsiniz:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              <li>Hangi verilerinizin işlendiğini öğrenme</li>
              <li>Verilerinizin düzeltilmesini veya silinmesini talep etme</li>
              <li>İşleme amacına itiraz etme</li>
              <li>Kanuna aykırı işlem sonucu zarar görmeniz halinde tazminat talep etme</li>
            </ul>
            <p className="mt-2">Bu haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.</p>
          </div>

        </div>

      </div>
    </div>
  );
}
