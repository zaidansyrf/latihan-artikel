import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const totalArticles = await prisma.article.count();

  const publishedArticles = await prisma.article.count({
    where: { published: true },
  });

  const pendingArticles = await prisma.article.count({
    where: { published: false },
  });

  const totalCategories = await prisma.category.count();

  const latestArticles = await prisma.article.findMany({
    include: {
      categoryRel: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  return (
    <main className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Kelola cerita, kategori, dan publikasi cerita.</p>
        </div>

        <Link href="/admin/articles" className="admin-primary-btn">
          Kelola
        </Link>
      </div>

      <section className="admin-stats">
        <div className="admin-stat-card">
          <span className="admin-stat-icon">📝</span>
          <p>Total Artikel</p>
          <h2>{totalArticles}</h2>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-icon">✅</span>
          <p>Published</p>
          <h2>{publishedArticles}</h2>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-icon">⏳</span>
          <p>Pending</p>
          <h2>{pendingArticles}</h2>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-icon">🏷️</span>
          <p>Kategori</p>
          <h2>{totalCategories}</h2>
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-header">
          <h2>Artikel Terbaru</h2>
          <Link href="/admin/articles">Lihat semua</Link>
        </div>

        <div className="admin-article-list">
          {latestArticles.map((article) => (
            <div className="admin-article-row" key={article.id}>
              <div>
                <h3>{article.title}</h3>
                <p>
                  {article.categoryRel?.name ||
                    article.category ||
                    "Article"}{" "}
                  · By {article.author}
                </p>
              </div>

              <span
                className={
                  article.published
                    ? "status-badge published"
                    : "status-badge draft"
                }
              >
                {article.published ? "Published" : "Pending"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}