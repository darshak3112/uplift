"use client";
import React, { useState, useEffect } from "react";
import { animateScroll as scroll } from "react-scroll";
import { FaArrowCircleUp } from "react-icons/fa";

export const GoToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to 300px
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    scroll.scrollToTop();
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-5 right-5">
      {isVisible && (
        <button
          type="button"
          onClick={scrollToTop}
          className="p-3 text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          <FaArrowCircleUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
