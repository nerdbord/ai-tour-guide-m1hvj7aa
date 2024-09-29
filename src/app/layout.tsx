import type { Metadata } from "next";
import "./globals.css";
import { Lora, Inter } from "next/font/google"; // Import czcionek

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ByKociołek",
  description: "tutaj opis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${lora.className} ${inter.className} flex justify-center items-start min-h-full`}
      >
        <div
          className="flex flex-col justify-between 
             h-full w-full md:w-[393px] lg:mx-auto relative main-bg"
        >
          {children}
        </div>
      </body>
    </html>
  );
}
