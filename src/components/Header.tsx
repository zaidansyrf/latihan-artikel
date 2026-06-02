"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeSwitcher from './ThemeSwitcher';
function Header() {
  const pathname = usePathname();

  return (
    <header className="header">
      <nav>
        <div className="logo">
          <Link href="/">MyArticles</Link>
        </div>

        <div className="nav-links">
          <Link
            href="/"
            className={pathname === "/" ? "active" : undefined}
          >
            Home
          </Link>
          <Link
            href="/posts"
            className={pathname.startsWith("/posts") ? "active" : undefined}
          >
            Post
          </Link>
          <Link
            href="/about"
            className={pathname === "/about" ? "active" : undefined}
          >
            About
          </Link>
        </div>
        <ThemeSwitcher/>
      </nav>
    </header>
  );
}

export default Header
