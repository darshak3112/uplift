"use client";

import { Button, Navbar } from "flowbite-react";
import Image from "next/image";
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
    <Navbar fluid rounded className="mt-2">
      <Navbar.Brand href="/">
        <Image
          src="/images/Logo.png"
          width={80}
          height={250}
          className="h-6 sm:h-9"
          alt="App Name"
        />
        <span className="self-center text-3xl font-semibold whitespace-nowrap dark:text-white">
          Uplift
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Button color="blue">Login</Button>
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
