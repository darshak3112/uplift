"use client";

import { Navbar } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";
import { usePathname } from "next/navigation";

export function HeaderComponent() {
  const navigationItems = [
    { text: "Services", href: "#landingFeatured", id: "landingFeatured" },
    { text: "Pricing", href: "#landingPricing", id: "landingPricing" },
    { text: "Blog", href: "#landingBlogs", id: "landingBlogs" },
    { text: "Contact", href: "#landingContactUs", id: "landingContactUs" },
  ];
  const pathname = usePathname();

  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="/">
        <Image
          src="/images/Logo.png"
          width={70}
          height={350}
          className="h-6 sm:h-16"
          alt="App Name"
        />
        <span className="self-center text-3xl font-semibold whitespace-nowrap">
          Uplift
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Link
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2focus:outline-none "
          href={"/login"}
        >
          Login
        </Link>

        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Link
          color={"black"}
          className="text-xl cursor-pointer hover:text-blue-600"
          href="/"
        >
          Home
        </Link>
        {pathname === "/" &&
          navigationItems.map((item) => (
            <ScrollLink
              className="text-xl cursor-pointer hover:text-blue-600"
              key={item?.text}
              activeClass="active"
              to={item?.id}
              spy={true}
              smooth={true}
              offset={-50}
            >
              {item?.text}
            </ScrollLink>
          ))}
      </Navbar.Collapse>
    </Navbar>
  );
}
