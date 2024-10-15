"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";
import { usePathname, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/_lib/store/hooks";
import { logout } from "@/_lib/store/features/userInfo/userInfoSlice";
import { clearHistoryUser } from "@/_lib/store/features/shared/history/historyTesterSlice";
import { clearResponseTask } from "@/_lib/store/features/tester/responseTask/responseTaskSlice";
import { clearAvailableTask } from "@/_lib/store/features/tester/availableTask/availableTaskSlice";
import { clearSurveyTask } from "@/_lib/store/features/creator/surveyTask/surveyTaskSlice";
import { clearAnalyticsData } from "@/_lib/store/features/creator/analyticsData/analyticsDataSlice";
import { clearYouTubeTask } from "@/_lib/store/features/creator/youTubeTask/youTubeTaskSlice";

export function HeaderComponent() {
  const [authorizeToken, setAuthorizeToken] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { role } = useAppSelector((state) => state.userInfo);

  useEffect(() => {
    setIsClient(true);
    const token = getCookie("authorizeToken");
    setAuthorizeToken(token);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const { status } = await axios.get("/api/auth/logout");
      if (status === 200) {
        toast.success("Logout Successfully...");
        dispatch(logout());
        dispatch(clearHistoryUser());
        dispatch(clearResponseTask());
        dispatch(clearAvailableTask());
        dispatch(clearSurveyTask());
        dispatch(clearAnalyticsData());
        dispatch(clearYouTubeTask());
        setAuthorizeToken(null);
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <nav className="container px-4 py-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/images/Logo.png"
              width={40}
              height={40}
              alt="Uplift Logo"
              className="w-auto h-8 sm:h-10"
            />
            <span className="text-xl font-bold text-gray-800">Uplift</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-6 md:flex">
            <Link
              href="/"
              className="text-gray-600 transition-colors hover:text-blue-600"
            >
              Home
            </Link>
            {pathname === "/" &&
              navigationItems.map((item) => (
                <ScrollLink
                  key={item.text}
                  to={item.id}
                  spy={true}
                  smooth={true}
                  offset={-70}
                  className="text-gray-600 transition-colors cursor-pointer hover:text-blue-600"
                >
                  {item.text}
                </ScrollLink>
              ))}
            {authorizeToken && pathname !== "/dashboard" && (
              <Link
                href={role === "admin" ? "/admin/dashboard" : "/dashboard"}
                className="font-semibold text-blue-600 transition-colors hover:text-blue-800"
              >
                Dashboard
              </Link>
            )}
            {isClient &&
              (!authorizeToken ? (
                <Link
                  href={pathname === "/login" ? "/signup" : "/login"}
                  className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-full hover:bg-blue-700"
                >
                  {pathname === "/login" ? "Sign Up" : "Login"}
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-white transition-colors bg-red-500 rounded-full hover:bg-red-600"
                >
                  Logout
                </button>
              ))}
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="mt-4 space-y-4 md:hidden">
            <Link
              href="/"
              className="block text-gray-600 transition-colors hover:text-blue-600"
            >
              Home
            </Link>
            {pathname === "/" &&
              navigationItems.map((item) => (
                <ScrollLink
                  key={item.text}
                  to={item.id}
                  spy={true}
                  smooth={true}
                  offset={-70}
                  className="block text-gray-600 transition-colors cursor-pointer hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  {item.text}
                </ScrollLink>
              ))}
            {authorizeToken && pathname !== "/dashboard" && (
              <Link
                href={role === "admin" ? "/admin/dashboard" : "/dashboard"}
                className="block font-semibold text-blue-600 transition-colors hover:text-blue-800"
              >
                Dashboard
              </Link>
            )}
            {isClient &&
              (!authorizeToken ? (
                <Link
                  href={pathname === "/login" ? "/signup" : "/login"}
                  className="block px-4 py-2 text-center text-white transition-colors bg-blue-600 rounded-full hover:bg-blue-700"
                >
                  {pathname === "/login" ? "Sign Up" : "Login"}
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-white transition-colors bg-red-500 rounded-full hover:bg-red-600"
                >
                  Logout
                </button>
              ))}
          </div>
        )}
      </nav>
    </header>
  );
}
