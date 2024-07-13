"use client";

import { Button, Navbar } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";

export function HeaderComponent() {
  const navigationItems = [
    { text: "Home", href: "/", id: "landingHeroBanner" },
    { text: "Services", href: "#landingFeatured", id: "landingFeatured" },
    { text: "Pricing", href: "#landingPricing", id: "landingPricing" },
    { text: "Blog", href: "#landingBlogs", id: "landingBlogs" },
    { text: "Contact", href: "#landingContactUs", id: "landingContactUs" },
  ];

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
        <Button color="blue">
          <Link href={"/login"}>Login</Link>
        </Button>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        {navigationItems.map((item) => (
          <ScrollLink
            className="text-xl cursor-pointer"
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
