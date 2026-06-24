import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getReadingTime } from "@/lib/reading-time";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Header from "@/components/Header";

interface PrivateViewPageProps {
  params: {
    slug: string;
  };
}

// Fungsi mengambil data artikel (Sama seperti detail post, mendukung Slug & ID)
async function getPostBySlugOrId(slugOrId: string) {
  const numericId = Number(slugOrId);

  return prisma.article.findFirst({
    where: {
      OR: [
        {
          slug: slugOrId,
        },
        ...(Number.isNaN(numericId)
          ? []
          : [
              {
                id: numericId,
              },
            ]),
      ],
    },
    include: {
      categories: true,
      author: true,
    },
  });
}

export async function generateMetadata({
  params,
}: PrivateViewPageProps): Promise<Metadata> {
  const post = await getPostBySlugOrId(params.slug);
  if (!post) return { title: "Article Not Found" };
  return { title: `${post.title}` };
}

export default async function PrivateViewPostPage({
  params,
}: PrivateViewPageProps) {
  // 1. PROTEKSI LOGIN: Wajib login untuk melihat halaman ini
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const post = await getPostBySlugOrId(params.slug);

  if (!post) {
    notFound();
  }

  // 2. PROTEKSI KEPEMILIKAN: Hanya pemilik artikel yang bisa akses view privat ini
  if (post.userId !== session.user.id) {
    redirect("/my-page");
  }

  // Mengambil rekomendasi cerita lainnya
  const otherPosts = await prisma.article.findMany({
    where: {
      published: true,
      id: { not: post.id },
    },
    include: {
      categories: true,
      author: true,
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const randomOtherPosts = otherPosts
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return (
    <>
    <Header/>
    <main className="story-detail-page">
      <article className="story-detail">
        <div className="story-detail-header">
          {/* PENYESUAIAN 1: Tombol kembali sekarang mengarah ke /my-page */}
          <Link
            href="/my-page"
            className="story-back-icon"
            aria-label="Back to dashboard"
          >
            <ChevronLeft size={34} strokeWidth={3} />
          </Link>

          <h1>{post.title}</h1>
        </div>

        <div className="story-detail-image">
          {post.imageUrl ? (
            <img src={post.imageUrl} alt={post.title} />
          ) : (
            <span>thumbnail</span>
          )}
        </div>

        <div className="story-detail-layout">
          <aside className="story-author-box">
            <p>{post.author?.name || "Anonim"}</p>
            <span>
              {new Date(post.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              {" • "}
              {getReadingTime(post.content)}
            </span>
            
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}>
              {post.categories && post.categories.length > 0 ? (
                post.categories.map((cat: any) => (
                  <div key={cat.id} className="badge">{cat.name}</div>
                ))
              ) : (
                <div className="badge">Article</div>
              )}
            </div>
          </aside>

          <div 
            className="story-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

    </main>
    </>
  );
}