import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AdminArticlePreview({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const article = await prisma.article.findUnique({
    where: { id: Number(resolvedParams.id) },
  });

  if (!article) return notFound();

  return (
    <main className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Preview: {article.title}</h1>
          <p>Status: <strong style={{ color: article.published ? "#16a34a" : "#d97706" }}>{article.published ? "Published" : "Pending"}</strong></p>
        </div>
        <Link href="/admin/articles" className="admin-secondary-btn">
          &larr; Kembali
        </Link>
      </div>

      <div className="admin-form" style={{ maxWidth: "800px", margin: "0 auto", padding: "40px" }}>
        {article.imageUrl && (
          <div style={{ width: "100%", height: "400px", overflow: "hidden", borderRadius: "16px", marginBottom: "24px" }}>
            <img src={article.imageUrl} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}

        <h1 style={{ fontSize: "36px", marginBottom: "16px" }}>{article.title}</h1>
        <p style={{ color: "#64748b", margin: "0 0 32px 0" }}>Oleh: {article.author || "Anonim"}</p>

        {/* Menampilkan HTML konten dengan rapi */}
        <div className="story-content" dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>
    </main>
  );
}