import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import DeleteArticleConfirm from "@/components/DeleteArticleConfirm";

async function togglePublish(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  const published = formData.get("published") === "true";

  await prisma.article.update({
    where: { id },
    data: { published: !published },
  });

  revalidatePath("/admin/articles");
}

async function deleteArticle(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));

  await prisma.article.delete({ where: { id } });
  revalidatePath("/admin/articles");
}

// 1. TIPE DATA searchParams WAJIB MENGIKUTI STANDAR NEXT.JS 15
export default async function AdminArticlesPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 2. Await searchParams nya
  const searchParams = await props.searchParams;
  
  // 3. Pastikan tipe datanya menjadi string
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const status = typeof searchParams.status === "string" ? searchParams.status : "all";

  const articles = await prisma.article.findMany({
      where: {
        title: { contains: q },
        ...(status === "published" && { published: true }),
        ...(status === "pending" && { published: false }),
      },
      // TAMBAHKAN BLOK INCLUDE INI
      include: {
        author: true,       
        categories: true,  
      },
      orderBy: { createdAt: "desc" },
    });
  return (
    <main className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Kelola Artikel</h1>
          <p>Review artikel dari user dan atur status publish.</p>
        </div>

        <Link href="/admin/articles/create" className="admin-primary-btn">
          + Tambah Artikel
        </Link>
      </div>

      <div className="admin-toolbar">
        <form method="GET" action="/admin/articles" className="admin-search-wrapper" style={{ flex: 1 }}>
          <input type="hidden" name="status" value={status} />
          <input
            type="text"
            name="q"
            placeholder="Cari artikel..."
            defaultValue={q}
            className="admin-search-input"
            style={{ width: "100%" }}
          />
          {q && (
            <Link href={`/admin/articles?status=${status}`} className="admin-search-clear-btn" aria-label="Clear search">
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

        <div className="admin-filter-tabs">
          <Link href={`/admin/articles?status=all${q ? `&q=${q}` : ''}`}>
            <button className={status === "all" ? "active" : ""}>All</button>
          </Link>
          <Link href={`/admin/articles?status=pending${q ? `&q=${q}` : ''}`}>
            <button className={status === "pending" ? "active" : ""}>Pending</button>
          </Link>
          <Link href={`/admin/articles?status=published${q ? `&q=${q}` : ''}`}>
            <button className={status === "published" ? "active" : ""}>Published</button>
          </Link>
        </div>
      </div>

      {articles.length === 0 && (
        <div className="empty-state">
          <h3>Story tidak ditemukan</h3>
          <p>Coba gunakan kata kunci atau filter lain.</p>
        </div>
      )}

      <section className="admin-article-grid">
        {articles.map((article: any) => (
          <article className="admin-article-card" key={article.id}>
            <div className="admin-article-thumb">
              {article.imageUrl ? <img src={article.imageUrl} alt={article.title} /> : <span>No Image</span>}
            </div>

            <div className="admin-article-body">
             <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {article.categories && article.categories.length > 0 ? (
                  article.categories.map((cat: any) => (
                    <span key={cat.id} className="admin-category">{cat.name}</span>
                  ))
                ) : (
                  <span className="admin-category">Article</span>
                )}
              </div>

              <h3>{article.title}</h3>
              <p className="admin-article-desc">
                {article.content?.replace(/<[^>]*>/g, "").slice(0, 90)}...
              </p>
              <p className="admin-article-author">By {article.author?.name || article.author?.username || "Admin"}</p>

              <div className="admin-actions">
                <Link href={`/admin/articles/${article.id}/preview`} className="admin-link-btn">
                  Preview
                </Link>

                <Link href={`/admin/articles/${article.id}/edit`} className="admin-link-btn">
                  Edit
                </Link>
                
                <form action={togglePublish}>
                  <input type="hidden" name="id" value={article.id} />
                  <input type="hidden" name="published" value={String(article.published)} />
                  <button type="submit" className="admin-secondary-btn">
                    {article.published ? "Unpublish" : "Publish"}
                  </button>
                </form>
                
                <form action={deleteArticle}>
                  <input type="hidden" name="id" value={article.id} />
                  <DeleteArticleConfirm />
                </form>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}