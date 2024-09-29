import type { Metadata } from "next";
import "./globals.css";
import { Lora } from "next/font/google";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
});

/* const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  weight: ["200", "300", "400", "600", "700", "800", "900"],
});
 */
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
        className={` ${lora.className} flex justify-center items-start min-h-full`}
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
