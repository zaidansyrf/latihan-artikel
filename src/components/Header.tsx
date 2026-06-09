"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function handleScroll() {
      setIsOpen(false);
    }

    if (isOpen) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  const isHomeActive = pathname === "/";
  const isStoryActive = pathname.startsWith("/posts");
  const isAboutActive = pathname === "/about";

  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="header-logo">
          YourStory
        </Link>

        <button type="button" className={`mobile-menu-btn ${isOpen ? "active" : ""}`} onClick={() => setIsOpen((prev) => !prev)} aria-label="Toggle menu">
          {isOpen ? "×" : "☰"}
        </button>

        {isOpen && (
          <div className="menu-overlay" onClick={() => setIsOpen(false)}/>
        )}
        <nav ref={menuRef} className={`header-nav ${isOpen ? "open" : ""}`}>
          <Link href="/" className={isHomeActive ? "active" : ""} onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link href="/posts" className={isStoryActive ? "active" : ""} onClick={() => setIsOpen(false)}>
            Story
          </Link>
          <Link href="/about" className={isAboutActive ? "active" : ""} onClick={() => setIsOpen(false)}>
            About
          </Link>
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
}