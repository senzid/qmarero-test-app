import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getBillData } from "@/lib/get-data";
import { GlobalDataProvider } from "@/context/GlobalDataContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Qamarero App",
  description: "Qamarero App for pay the bill on table",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const globalData = await getBillData()

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
       <GlobalDataProvider data={globalData}>
          {children}
        </GlobalDataProvider>
      </body>
    </html>
  );
}
