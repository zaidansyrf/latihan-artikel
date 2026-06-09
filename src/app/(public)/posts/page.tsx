import { prisma } from "@/lib/prisma";
import { getReadingTime } from "@/lib/reading-time";
import Link from "next/link";
import MobileCategoryFilter from "@/components/MobileCategoryFilter";
import PaginationLimitSelect from "@/components/PaginationLimitSelect";

export const metadata = {
  title: "All Story",
  description: "Explore all different stories on YourStory.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: {
    q?: string;
    category?: string;
    page?: string;
    limit?: string;
  };
}) {
  const q = searchParams.q || "";
  const selectedCategory = searchParams.category || "all";

  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const allowedLimits = [10, 40, 80];
  const safeLimit = allowedLimits.includes(limit) ? limit : 10;

  const whereCondition = {
    published: true,

    ...(q && {
      OR: [
        {
          title: {
            contains: q,
          },
        },
        {
          content: {
            contains: q,
          },
        },
      ],
    }),

    ...(selectedCategory !== "all" && {
      categoryId: Number(selectedCategory),
    }),
  };

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const posts = await prisma.article.findMany({
    where: whereCondition,
    include: {
      categoryRel: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (page - 1) * safeLimit,
    take: safeLimit,
  });

  const totalPosts = await prisma.article.count({
    where: whereCondition,
  });

  const totalPages = Math.ceil(totalPosts / safeLimit);
  const shouldShowPagination = totalPosts > safeLimit;

  function createPageUrl(targetPage: number, targetLimit = safeLimit) {
    const params = new URLSearchParams();

    if (q) params.set("q", q);

    if (selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }

    params.set("page", String(targetPage));
    params.set("limit", String(targetLimit));

    return `/posts?${params.toString()}`;
  }
const startItem = totalPosts === 0 ? 0 : (page - 1) * safeLimit + 1;
const endItem = Math.min(page * safeLimit, totalPosts);
  return (
    <main className="posts-page">
      <section className="articles-banner">
        <div className="articles-shape articles-shape-left"></div>
        <div className="articles-shape articles-shape-right"></div>

        <div className="articles-banner-content">
          <h1>All Story</h1>
          <p>Explore for each other story.</p>
        </div>
      </section>

      <div className="posts-layout">
        <aside className="home-filter-sidebar">
          <form className="article-search" action="/posts">
            <input
              type="text"
              name="q"
              placeholder="Find Story"
              defaultValue={q}
              className="article-search-input"
            />

            <input type="hidden" name="category" value={selectedCategory} />
            <input type="hidden" name="limit" value={safeLimit} />

            {q && (
              <Link
                href={
                  selectedCategory !== "all"
                    ? `/posts?category=${selectedCategory}&limit=${safeLimit}`
                    : `/posts?limit=${safeLimit}`
                }
                className="article-search-clear"
                aria-label="Clear search"
              >
                ×
              </Link>
            )}

            <button
              type="submit"
              className="article-search-button"
              aria-label="Search"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>

          <div className="mobile-filter-form">
            <MobileCategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              q={q}
            />
          </div>

          <div className="desktop-filter-group">
            <h4>Filters</h4>

            <ul className="filter-list">
              <li>
                <Link
                  className={selectedCategory === "all" ? "active" : ""}
                  href={q ? `/posts?q=${q}&category=all&limit=${safeLimit}` : `/posts?limit=${safeLimit}`}
                >
                  All
                </Link>
              </li>

              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    className={
                      selectedCategory === String(category.id) ? "active" : ""
                    }
                    href={
                      q
                        ? `/posts?q=${q}&category=${category.id}&limit=${safeLimit}`
                        : `/posts?category=${category.id}&limit=${safeLimit}`
                    }
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section className="posts-content">
          {posts.length > 0 ? (
            <div className="article-grid">
              {posts.map((post) => (
                <Link
                  href={`/posts/${post.slug || post.id}`}
                  className="article-card"
                  key={post.id}
                >
                  <div className="card-image">
                    {post.imageUrl ? (
                      <img src={post.imageUrl} alt={post.title} />
                    ) : (
                      <span>Thumbnail</span>
                    )}
                  </div>

                  <div className="card-content">
                    <span className="badge">
                      {post.categoryRel?.name || post.category || "Article"}
                    </span>

                    <h3>{post.title}</h3>
                    <p>{post.content.slice(0, 90)}...</p>
                    <p className="meta">
                      By {post.author} • {getReadingTime(post.content)}
                    </p>

                    <div className="card-footer">
                      <span className="read-more">Read more →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>No stories found</h3>
              <p>Try another keyword or browse all available stories.</p>
              <Link href="/posts" className="empty-button">
                Explore Story
              </Link>
            </div>
          )}

          {shouldShowPagination && (
            <div className="pagination-bar">
              <form className="pagination-show" action="/posts">
                <span>Show</span>

                {q && <input type="hidden" name="q" value={q} />}

                {selectedCategory !== "all" && (
                  <input
                    type="hidden"
                    name="category"
                    value={selectedCategory}
                  />
                )}

                <input type="hidden" name="page" value="1" />

                <PaginationLimitSelect safeLimit={safeLimit} />
              </form>
              <p className="pagination-info">
                Showing {startItem}–{endItem} of {totalPosts} stories
              </p>
              <div className="pagination-controls">
                {page > 1 && (
                  <>
                    <Link href={createPageUrl(1)} className="pagination-icon">
                      «
                    </Link>

                    <Link href={createPageUrl(page - 1)} className="pagination-icon">
                      ‹
                    </Link>
                  </>
                )}

                <div className="pagination-pages">
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;

                    return (
                      <Link
                        key={pageNumber}
                        href={createPageUrl(pageNumber)}
                        className={page === pageNumber ? "active" : ""}
                      >
                        {pageNumber}
                      </Link>
                    );
                  })}
                </div>

                {page < totalPages && (
                  <>
                    <Link href={createPageUrl(page + 1)} className="pagination-icon">
                      ›
                    </Link>

                    <Link href={createPageUrl(totalPages)} className="pagination-icon">
                      »
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}