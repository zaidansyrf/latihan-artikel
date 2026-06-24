"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react"; // 1. Import useSession
import ThemeSwitcher from "./ThemeSwitcher";

export default function Header() {
  const { data: session } = useSession(); // 2. Ambil data login
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
  const isMyPageActive = pathname === "/my-page"; // 3. State active untuk My Page
  const isAboutActive = pathname === "/about";

  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="header-logo">
          YourStory
        </Link>
        <div className="header-actions">
        {!session && (
          <Link href="/api/auth/signin" className="join-button-header" onClick={() => setIsOpen(false)}>
            Join
          </Link>
        )}
        {session &&(
          <Link href="/api/auth/signout" className="mobile-logout-icon" aria-label="Logout">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </Link>)}
        {/* mobile hamburger */}
        <button type="button" className={`mobile-menu-btn ${isOpen ? "active" : ""}`} onClick={() => setIsOpen((prev) => !prev)} aria-label="Toggle menu">
          {isOpen ? "×" : "☰"}
        </button>
      </div>

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
          {/* Session my-page active */}
          {session && (
            <Link href="/my-page" className={isMyPageActive ? "active" : ""} onClick={() => setIsOpen(false)}>
              My Page
            </Link>
          )}
          <Link href="/about" className={isAboutActive ? "active" : ""} onClick={() => setIsOpen(false)}>
            About
          </Link>
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
}