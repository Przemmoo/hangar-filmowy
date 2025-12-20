import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hangar Filmowy - Ekran LED na Wynajem",
  description: "Prawdziwe kino pod gwiazdami. Wypożycz nasz profesjonalny ekran LED na eventy, kino plenerowe i wydarzenia firmowe.",
  keywords: "ekran LED, kino plenerowe, wynajem ekranu, event outdoor, kino samochodowe",
  openGraph: {
    title: "Hangar Filmowy - Ekran LED na Wynajem",
    description: "Prawdziwe kino pod gwiazdami. Wypożycz nasz profesjonalny ekran LED.",
    url: "https://hangarfilmowy.pl",
    siteName: "Hangar Filmowy",
    locale: "pl_PL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
