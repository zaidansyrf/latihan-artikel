import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-xl font-bold mb-8">Admin CMS</h2>

        <nav className="space-y-3">
          <Link href="/admin" className="block hover:text-blue-400">
            Dashboard
          </Link>

          <Link href="/admin/posts" className="block hover:text-blue-400">
            Artikel
          </Link>

          <Link href="/admin/categories" className="block hover:text-blue-400">
            Kategori
          </Link>

          <Link href="/admin/profile" className="block hover:text-blue-400">
            Profile
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}