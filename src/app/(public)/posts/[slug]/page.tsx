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
      categoryRel: true,
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

  const description = post.content.slice(0, 150);

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
      categoryRel: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });

  const randomOtherPosts = otherPosts
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const description = post.content.slice(0, 150);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: post.imageUrl || "",
    author: {
      "@type": "Person",
      name: post.author,
    },
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    articleSection: post.categoryRel?.name || post.category || "Article",
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
            <p>{post.author}</p>
            <span>
              {new Date(post.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              {" • "}
              {getReadingTime(post.content)}
            </span>
            <div className="badge">
              {post.categoryRel?.name || post.category || "Article"}
            </div>
          </aside>

          <div className="story-content">
            {post.content.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
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
                <span className="badge">
                  {item.categoryRel?.name || item.category || "Article"}
                </span>

                <h3>{item.title}</h3>
                <p>{item.content.slice(0, 90)}...</p>
                <p className="meta">By {item.author} • {getReadingTime(post.content)}</p>

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