import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat"
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hangarfilmowy.pl'),
  title: "Hangar Filmowy - Ekran LED na Wynajem",
  description: "Prawdziwe kino pod gwiazdami. Wypożycz nasz profesjonalny ekran LED na eventy, kino plenerowe i wydarzenia firmowe.",
  keywords: "ekran LED, kino plenerowe, wynajem ekranu, event outdoor, kino samochodowe",
  alternates: {
    canonical: 'https://hangarfilmowy.pl',
  },
  icons: {
    icon: '/hangar_filmowy.svg',
    shortcut: '/hangar_filmowy.svg',
    apple: '/hangar_filmowy.svg',
  },
  openGraph: {
    title: "Hangar Filmowy - Ekran LED na Wynajem",
    description: "Prawdziwe kino pod gwiazdami. Wypożycz nasz profesjonalny ekran LED.",
    url: "https://hangarfilmowy.pl",
    siteName: "Hangar Filmowy",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: '/hangar_filmowy.svg',
        width: 320,
        height: 200,
        alt: 'Hangar Filmowy Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hangar Filmowy - Ekran LED na Wynajem',
    description: 'Prawdziwe kino pod gwiazdami. Wypożycz nasz profesjonalny ekran LED.',
    images: ['/hangar_filmowy.svg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Hangar Filmowy',
    description: 'Profesjonalny wynajem ekranów LED na kino plenerowe',
    url: 'https://hangarfilmowy.pl',
    telephone: '+48602451036',
    email: 'pokaz@hangarfilmowy.pl',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'PL',
    },
    priceRange: '$$',
    image: 'https://hangarfilmowy.pl/hangar_filmowy.svg',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '1',
    },
  };

  return (
    <html lang="pl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={montserrat.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
