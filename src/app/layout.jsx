import { Inter } from "next/font/google";
import "./globals.css";
import { HeaderComponent } from "@/components/shared/Header";
import { FooterComponent } from "@/components/shared/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Uplift",
  description:
    "Uplift bridges the gap between businesses and passionate testers. Get valuable feedback on products, content, and marketing to ensure success. Businesses gain actionable insights, testers earn rewards. Launch with confidence!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="/images/Logo.png" sizes="any" />
      <body className={inter.className}>
        <HeaderComponent />
        {children}
        <FooterComponent />
      </body>
    </html>
  );
}
