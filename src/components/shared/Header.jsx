"use client";

import { Button, Navbar } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";
import { usePathname, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export function HeaderComponent() {
  const [authorizeToken, setAuthorizeToken] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Ensure this runs only on the client
    setIsClient(true);
    const token = getCookie("authorizeToken");
    setAuthorizeToken(token);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      // Make a request to the logout route
      const { status } = await axios.get("/api/auth/logout");

      if (status === 200) {
        toast.success("Logout Successfully...");
        setAuthorizeToken(null); // Clear the token state
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navigationItems = [
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
        {isClient &&
          (!authorizeToken ? (
            <Link
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
              href={pathname === "/login" ? "/signup" : "/login"}
            >
              {pathname === "/login" ? "SignUp" : "Login"}
            </Link>
          ) : (
            <Button color={"blue"} onClick={handleLogout}>
              Logout
            </Button>
          ))}
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
        {authorizeToken && pathname !== "/dashboard" && (
          <Link
            className="text-xl font-semibold text-blue-600 cursor-pointer"
            href="/dashboard"
          >
            DashBoard
          </Link>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
