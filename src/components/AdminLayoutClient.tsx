"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/app/admin/logout/action";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>MyAdmin</h2>

        <nav>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/articles">List cerita</Link>
          <Link href="/admin/categories">Categories</Link>
          <Link href="/">View Site</Link>

          <form action={logoutAdmin}>
            <button type="submit" className="admin-logout-btn">
              Logout
            </button>
          </form>
        </nav>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}