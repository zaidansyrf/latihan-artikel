import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import UserDeleteButton from "@/components/UserDeleteButton";
import Header from "@/components/Header";
import MobileCategoryFilter from "@/components/MobileCategoryFilter";
import ToastTrigger from "@/components/ToastTrigger";
import Footer from "@/components/Footer";

export const metadata = {
  title: "My Page ",
};

export default async function MyPage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    category?: string;
  };
}) {
  // 1. Cek sesi login
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  // 2. TANGKAP PARAMETER URL (Search & Filter)
  const q = searchParams.q || "";
  const selectedCategory = searchParams.category || "all";

  // 3. LOGIKA FILTER PRISMA KHUSUS MY PAGE
  const whereCondition: any = {
    userId: session.user.id, // WAJIB: Hanya artikel milik dia
  };

  // Jika ada teks pencarian
  if (q) {
    whereCondition.OR = [
      { title: { contains: q } },
      { content: { contains: q } },
    ];
  }

  // Jika klik kategori tertentu
  if (selectedCategory !== "all") {
    whereCondition.categories = {
      some: {
        id: Number(selectedCategory),
      },
    };
  }

  // Ambil list semua kategori untuk ditampilkan di sidebar
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  // Ambil artikel milik user sesuai filter
  const myArticles = await prisma.article.findMany({
    where: whereCondition,
    include: { 
      categories: true 
    },
    orderBy: { 
      id: "desc" 
    },
  });

  return (
    <>
      <Header />
      <main className="mypage-container">
        {searchParams?.success && <ToastTrigger />}
        {/* --- BANNER --- */}
        <div className="mypage-banner">
          <h1>This is YourPage</h1>
          <p>Start writing your stories</p>
        </div>

        {/* --- TOP ACTIONS --- */}
        <div className="mypage-top-actions">
          <Link href="/my-page/create" className="btn-mypage-create">
            Create
          </Link>
        </div>

        {/* --- MAIN LAYOUT --- */}
        <div className="mypage-layout">
          {/* SIDEBAR (Desktop) & MOBILE CONTROLS */}
          <aside className="home-filter-sidebar" style={{ alignSelf: "start" }}>
             <form className="article-search" action="/my-page">
                  <input type="text" name="q" placeholder="Search" defaultValue={q} className="article-search-input" />
                  <input type="hidden" name="category" value={selectedCategory} />
                  {q && (
                    <Link href={selectedCategory !== "all" ? `/my-page?category=${selectedCategory}` : `/my-page`}  className="article-search-clear" aria-label="Clear search">
                      &times;
                    </Link>
                  )}
                  <button type="submit" className="article-search-button" aria-label="Search">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </button>
                </form>
            {/* === KELOMPOK KONTROL MOBILE (Search & Filter Sebelahan) === */}
            <div className="mobile-controls-wrapper">
              <div className="mobile-search-filter-row">
                <div className="mobile-filter-form">
                  <MobileCategoryFilter categories={categories} selectedCategory={selectedCategory} q={q} basePath="/my-page" />
                </div>
              </div>
            </div>

            {/* BENTUK FILTER DESKTOP (Sembunyi di Mobile) */}
            <div className="desktop-filter-group">
              <h4>Filters</h4>
              <ul className="filter-list">
                <li>
                  <Link
                    className={selectedCategory === "all" ? "active" : ""}
                    href={q ? `/my-page?q=${q}&category=all` : `/my-page`}
                  >
                    All
                  </Link>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      className={selectedCategory === String(category.id) ? "active" : ""}
                      href={q ? `/my-page?q=${q}&category=${category.id}` : `/my-page?category=${category.id}`}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
              
              <div className="mypage-logout-wrapper" style={{ marginTop: "40px" }}>
                 <Link href="/api/auth/signout" className="btn-mypage-logout">
                   Logout
                 </Link>
              </div>
            </div>
          </aside>

          <div className="mypage-grid">
            {myArticles.length === 0 ? (
              <div className="empty-state"><h3>Tidak ada cerita</h3></div>
            ) : (
              myArticles.map((article: any) => (
                <div key={article.id} className="mypage-card">
                  {/* Gambar */}
                  <div className="mypage-card-image">
                    {article.imageUrl ? (
                      <Image src={article.imageUrl} alt={article.title} fill className="img-cover" />
                    ) : (
                      <div className="img-placeholder">No Image</div>
                    )}
                  </div>

                  {/* Badge & Status */}
                  <div className="mypage-card-meta">
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                      {article.categories && article.categories.length > 0 ? (
                        article.categories.map((cat: any) => (
                          <span key={cat.id} className="badge">{cat.name}</span>
                        ))
                      ) : (
                        <span className="badge">Article</span>
                      )}
                    </div>

                    <span className="badge-status">{article.published ? "Published" : "Draft"}</span>
                  </div>

                  {/* Text */}
                  <div className="mypage-card-content">
                    <h2 className="mypage-card-title">{article.title}</h2>
                    <p className="mypage-card-excerpt">Isi dari artikel...</p>
                  </div>

                  {/* Tombol Aksi */}
                  <div className="mypage-card-actions">
                    <Link href={`/my-page/view/${article.slug || article.id}`} className="btn-action view">View</Link>
                    <Link href={`/my-page/edit/${article.id}`} className="btn-action edit">Edit</Link>
                    <UserDeleteButton id={article.id} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* === TOMBOL FLOATING CREATE KHUSUS MOBILE === */}
        <Link href="/my-page/create" className="fab-create-mobile" aria-label="Create Article">
          +
        </Link>

      </main>
      <Footer />
    </>
  );
}