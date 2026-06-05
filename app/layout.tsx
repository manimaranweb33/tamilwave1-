import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "TamilWave | Tamil Entertainment Index", template: "%s | TamilWave" },
  description: "Discover Tamil movies, web series, dubbed titles and entertainment updates in one fresh index.",
  keywords: ["Tamil movies", "Tamil dubbed movies", "Tamil entertainment", "Tamil web series"],
  openGraph: { title: "TamilWave", description: "Your fresh Tamil entertainment index.", type: "website" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <Header />
        <main className="animate-fade-in pb-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
