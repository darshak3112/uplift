import Image from "next/image";
import { HeroBanner } from "@/components/landing/HeroBanner";
import { Featured } from "@/components/landing/Featured";
import { Clints } from "@/components/landing/Clients";
import { Testimony } from "@/components/landing/Testimony";
import { Pricing } from "@/components/landing/Pricing";
import { Stats } from "@/components/landing/Stats";
import { ContactUs } from "@/components/landing/ContactUs";
import { Blogs } from "@/components/landing/Blogs";
import { FAQ } from "@/components/landing/FAQ";
import { GoToTopButton } from "@/components/shared/GoToTop";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <Featured />
      <Clints />
      <Pricing />
      <Testimony />
      <Stats />
      <Blogs />
      <FAQ />
      <ContactUs />
      <GoToTopButton />
    </>
  );
}
