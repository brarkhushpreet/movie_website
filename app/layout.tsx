import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { AppProviders } from "@/components/AppProviders";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://movies.khushpreet.dev"),
  title: { default: "Movie Explorer — Stories after dark", template: "%s · Movie Explorer" },
  description: "A cinematic streaming discovery experience powered by TMDB.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${manrope.variable}`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
