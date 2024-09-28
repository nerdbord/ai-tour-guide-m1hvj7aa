import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Bajkocioł",
  description: "tutaj opis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.className} flex justify-center items-start h-full overflow-hidden`}
      >
        <div
          className="flex flex-col justify-between bg-gray-600 
             h-full w-full 
             md:h-[652px] md:w-[393px] md:max-h-[100vh] lg:mx-auto relative"
        >
          {children}
        </div>
      </body>
    </html>
  );
}
