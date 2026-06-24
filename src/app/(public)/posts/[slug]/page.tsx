import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getReadingTime } from "@/lib/reading-time";

interface DetailPostPageProps {
  params: {
    slug: string;
  };
}

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
}: DetailPostPageProps): Promise<Metadata> {
  const post = await getPostBySlugOrId(params.slug);

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  const description = post.content.replace(/<[^>]*>/g, "").slice(0, 150);

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      images: post.imageUrl
        ? [
            {
              url: post.imageUrl,
              width: 1200,
              height: 630,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.imageUrl ? [post.imageUrl] : [],
    },
  };
}

export default async function DetailPostPage({
  params,
}: DetailPostPageProps) {
  const post = await getPostBySlugOrId(params.slug);

  if (!post) {
    notFound();
  }

  const otherPosts = await prisma.article.findMany({
    where: {
      published: true,
      id: {
        not: post.id,
      },
    },
    include: {
      categories: true,
      author: true
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });

  const randomOtherPosts = otherPosts
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const description = post.content.replace(/<[^>]*>/g, "").slice(0, 150);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: post.imageUrl || "",
    author: {
      "@type": "Person",
      name: post.author?.name || "Admin",
    },
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    articleSection: post.categories && post.categories.length > 0 
      ? post.categories.map((c: any) => c.name).join(", ") 
      : "Article",
    description,
  };

  return (
    <main className="story-detail-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <article className="story-detail">
        <div className="story-detail-header">
          <Link
            href="/posts"
            className="story-back-icon"
            aria-label="Back to articles"
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
            <p>{post.author?.name || (typeof post.author === 'string' ? post.author : "Anonim")}</p>
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

      <section className="related-stories">
        <h2>Story lainnya</h2>
        <div className="article-grid">
          {randomOtherPosts.map((item) => (
            <Link href={`/posts/${item.slug || item.id}`} className="article-card" key={item.id}>
              <div className="card-image">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} />
                ) : (
                  <span>Thumbnail</span>
                )}
              </div>

              <div className="card-content">
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                  {item.categories && item.categories.length > 0 ? (
                    item.categories.map((cat: any) => (
                      <span key={cat.id} className="badge">{cat.name}</span>
                    ))
                  ) : (
                    <span className="badge">Article</span>
                  )}
                </div>

                <h3>{item.title}</h3>
                <p className="meta">{item.author?.name || (typeof item.author === 'string' ? item.author: "Admin")} • {getReadingTime(item.content)}</p>

                <div className="card-footer">
                  <span className="read-more">Read more →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}