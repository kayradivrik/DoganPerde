import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import MobileActionBar from "@/components/MobileActionBar";
import CookieBanner from "@/components/CookieBanner";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"]
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  metadataBase: new URL('https://doganperdecekmekoy.com'),
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'googlecc997dfebcfd6787',
  },
  title: {
    default: "Çekmeköy Perdeci - Doğan Perde | Çekmeköy Tül, Stor, Fon Perde",
    template: "%s | Çekmeköy Doğan Perde"
  },
  description: "Çekmeköy perde mağazası Doğan Perde: Çekmeköy, Çamlık, Sancaktepe ve Ümraniye bölgesinde özel ölçü tül, stor, zebra, fon ve motorlu perde modelleri. Ücretsiz keşif ve montaj!",
  keywords: [
    "Çekmeköy perde",
    "Çekmeköy perdeci",
    "Doğan Perde",
    "Çekmeköy Doğan Perde",
    "Çekmeköy tül perde",
    "Çekmeköy stor perde",
    "Çekmeköy zebra perde",
    "Çekmeköy fon perde",
    "Çekmeköy motorlu perde",
    "Çekmeköy cam balkon perdesi",
    "Sancaktepe perdeci",
    "Ümraniye perdeci"
  ],
  authors: [{ name: "Doğan Perde" }],
  creator: "Doğan Perde",
  publisher: "Doğan Perde",
  formatDetection: {
    telephone: true,
    address: true,
    email: false
  },
  openGraph: {
    title: "Çekmeköy Perdeci - Doğan Perde | Özel Ölçü Perde Tasarımları",
    description: "Çekmeköy'ün lider perde mağazası Doğan Perde. Tül, stor, zebra, fon ve akıllı motorlu perde modellerinde ücretsiz keşif ve dikiş atölyesi garantisi.",
    siteName: "Doğan Perde Çekmeköy",
    locale: "tr_TR",
    type: "website"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HomeGoodsStore",
  "name": "Doğan Perde",
  "alternateName": "Çekmeköy Doğan Perde",
  "telephone": "+905417310749",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Şahinbey Cd. Çamlık Mah. No:114 Dük:A (Doğa Parkı Yanı)",
    "addressLocality": "Çekmeköy",
    "addressRegion": "İstanbul",
    "postalCode": "34782",
    "addressCountry": "TR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 41.0315,
    "longitude": 29.1762
  },
  "priceRange": "₺₺",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "19:30"
    }
  ],
  "sameAs": [
    "https://instagram.com/doganperde_cekmekoy",
    "https://facebook.com"
  ]
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="tr"
      className={`${playfair.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-slate-900 font-sans">
        <Navbar />
        <main className="flex-1 pt-0 pb-24 md:pb-0">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
        <MobileActionBar />
        <CookieBanner />
      </body>
    </html>
  );
}
