"use client";
import React from 'react';
import Link from 'next/link';
import { Scale, ArrowLeft } from 'lucide-react';

export default function KvkkPage() {
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
            <Scale size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Yasal Bilgilendirme</span>
            <h1 className="text-2xl sm:text-3xl font-serif text-slate-900 font-bold mt-0.5">KVKK Aydınlatma Metni</h1>
          </div>
        </div>

        {/* Content */}
        <div className="text-slate-650 text-sm leading-relaxed flex flex-col gap-6 font-medium">
          <p>
            <strong>Doğan Perde</strong> olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında, kişisel verilerinizin gizliliğine ve güvenliğine büyük önem veriyoruz. Bu metin, web sitemiz üzerinden toplanan kişisel verilerinizin hangi amaçlarla işlendiği, nasıl saklandığı ve haklarınız hakkında sizi bilgilendirmek amacıyla hazırlanmıştır.
          </p>

          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 font-serif">1. Veri Sorumlusu</h2>
            <p>
              Kişisel verileriniz, veri sorumlusu sıfatıyla Doğan Perde tarafından KVKK’ya uygun olarak işlenmektedir.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 font-serif">2. Hangi Veriler Toplanır?</h2>
            <p>Web sitemizi ziyaret ettiğinizde, iletişim veya teklif formlarımızı doldurduğunuzda aşağıdaki kişisel verileriniz toplanabilir:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              <li>Ad, soyad</li>
              <li>Telefon numarası</li>
              <li>E-posta adresi</li>
              <li>Adres bilgisi / Talep detayları</li>
              <li>IP adresi ve temel çerez verileri</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 font-serif">3. Verileriniz Hangi Amaçlarla İşlenir?</h2>
            <p>Toplanan veriler aşağıdaki amaçlarla kullanılabilir:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5">
              <li>Hizmet taleplerinize, fiyat/ölçü teklifi ve sorularınıza yanıt verebilmek</li>
              <li>Sipariş ve montaj süreçlerini yürütmek</li>
              <li>Müşteri memnuniyetini sağlamak ve hizmetlerimizi iyileştirmek</li>
              <li>Yasal yükümlülüklerimizi yerine getirmek</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 font-serif">4. Verilerin Aktarılması</h2>
            <p>
              Kişisel verileriniz, yasal zorunluluklar çerçevesinde yetkili kamu kurum ve kuruluşlarıyla paylaşılabilir. Verileriniz, izniniz olmadan üçüncü şahıslarla ticari amaçla kesinlikle paylaşılmaz veya satılmaz.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 font-serif">5. İletişim ve Haklarınız</h2>
            <p>
              KVKK’nın 11. maddesi uyarınca; verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini veya silinmesini talep etme hakkına sahipsiniz. Talepleriniz için <a href="mailto:info@doganperde.com" className="text-primary-600 font-bold hover:underline">info@doganperde.com</a> e-posta adresi veya <a href="tel:+905354857631" className="text-primary-600 font-bold hover:underline">0535 485 76 31</a> numaralı telefon üzerinden bizimle iletişime geçebilirsiniz.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
