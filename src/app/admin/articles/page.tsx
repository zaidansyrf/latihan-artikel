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
    data: {
      published: !published,
    },
  });

  revalidatePath("/admin/articles");
  revalidatePath("/");
  revalidatePath("/posts");
}
async function deleteArticle(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));

  await prisma.article.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/articles");
  revalidatePath("/");
  revalidatePath("/posts");
}

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    status?: string;
  };
}) {
  const q = searchParams.q || "";
  const status = searchParams.status || "all";

  const articles = await prisma.article.findMany({
    where: {
      title: {
        contains: q,
      },
      ...(status === "published" && {
        published: true,
      }),
      ...(status === "pending" && {
        published: false,
      }),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <main className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Kelola Artikel</h1>
          <p>Review artikel dari user dan atur status publish.</p>
        </div>

        <Link href="/posts/create" className="admin-primary-btn">
          + Tambah Artikel
        </Link>
      </div>

      <form className="admin-toolbar">
        <input
          type="text"
          name="q"
          placeholder="Cari artikel..."
          defaultValue={q}
          className="admin-search-input"
        />

        <div className="admin-filter-tabs">
          <button
            type="submit"
            name="status"
            value="all"
            className={status === "all" ? "active" : ""}
          >
            All
          </button>

          <button
            type="submit"
            name="status"
            value="pending"
            className={status === "pending" ? "active" : ""}
          >
            Pending
          </button>

          <button
            type="submit"
            name="status"
            value="published"
            className={status === "published" ? "active" : ""}
          >
            Published
          </button>
        </div>
      </form>
      {articles.length === 0 && (
        <div className="empty-state">
          <h3>Artikel tidak ditemukan</h3>
          <p>Coba gunakan kata kunci atau filter lain.</p>
        </div>
    )}
      <section className="admin-article-grid">
        {articles.map((article) => (
          <article className="admin-article-card" key={article.id}>
            <div className="admin-article-thumb">
              {article.imageUrl ? (
                <img src={article.imageUrl} alt={article.title} />
              ) : (
                <span>Thumbnail</span>
              )}
            </div>

            <div className="admin-article-body">
              <div className="admin-article-meta">
                <span className="admin-category">
                 {article.categoryRel?.name || article.category || "Article"}
                </span>

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

              <h3>{article.title}</h3>

              <p className="admin-article-desc">
                {article.content.slice(0, 90)}...
              </p>

              <p className="admin-article-author">
                By {article.author}
              </p>

              <div className="admin-actions">
                <Link
                  href={`/posts/${article.id}`}
                  className="admin-link-btn"
                >
                  Preview
                </Link>

                <Link
                  href={`/admin/articles/${article.id}/edit`}
                  className="admin-link-btn"
                >
                  Edit
                </Link>
                <form action={togglePublish}>
                  <input type="hidden" name="id" value={article.id} />
                  <input
                    type="hidden"
                    name="published"
                    value={String(article.published)}
                  />

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