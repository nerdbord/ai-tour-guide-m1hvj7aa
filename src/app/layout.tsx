import type { Metadata } from "next";
import "./globals.css";
import { Lora, Nunito_Sans } from "next/font/google";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  weight: ["200", "300", "400", "600", "700", "800", "900"],
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
    <html lang="en" className="h-full">
      <body
        className={` ${lora.className} ${nunitoSans.className} flex justify-center items-start h-full overflow-hidden `}
      >
        <div
          className="flex flex-col justify-between 
             h-full w-full 
             md:h-[652px] md:w-[393px] md:max-h-[100vh] lg:mx-auto relative main-bg"
        >
          {children}
        </div>
      </body>
    </html>
  );
}
