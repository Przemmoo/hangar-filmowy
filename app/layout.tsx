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
  title: "Hangar Filmowy - Ekran LED na Wynajem",
  description: "Prawdziwe kino pod gwiazdami. Wypożycz nasz profesjonalny ekran LED na eventy, kino plenerowe i wydarzenia firmowe.",
  keywords: "ekran LED, kino plenerowe, wynajem ekranu, event outdoor, kino samochodowe",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className={montserrat.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
