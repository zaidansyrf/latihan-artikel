import Link from "next/link";
import { getLastPost } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { getReadingTime } from "@/lib/reading-time";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import MobileCategoryFilter from "@/components/MobileCategoryFilter";

export const metadata = {
  title: "Home",
  description: "Write, Share, and Read your stories on YourStory.",
};

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  const posts = await getLastPost();
  const featuredPost = posts[0];
  const latestPosts = posts.slice(1);

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="home-page">
      <section className="hero-banner">
        <div className="hero-shape hero-shape-left"></div>
        <div className="hero-shape hero-shape-right"></div>

        <div className="hero-content">
          <h1>Welcome to YourStory</h1>
          <p>Write, Share, and Read your own Story.</p>
        </div>
      </section>

      <section className="home-content-layout">
        <aside className="home-filter-sidebar">
          <form className="article-search" action="/posts">
            <input
              type="text"
              name="q"
              placeholder="Find Story"
              className="article-search-input"
            />

            <input type="hidden" name="category" value="all" />

            <button
              type="submit"
              className="article-search-button"
              aria-label="Search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>

          <div className="mobile-filter-form">
            <MobileCategoryFilter
              categories={categories}
              selectedCategory="all"
            />
          </div>

          <div className="desktop-filter-group">
            <h4>Filters</h4>

            <ul className="filter-list">
              <li>
                <Link className="active" href="/posts">
                  All
                </Link>
              </li>

              {categories.map((category) => (
                <li key={category.id}>
                  <Link href={`/posts?category=${category.id}`}>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {!session && (
            <div className="story-cta">
              <p>Have a story to tell?</p>
              <Link href="/api/auth/signin" className="story-cta-btn">
                Join
              </Link>
            </div>
          )}
        </aside>

        <div className="home-main-content">
          {featuredPost && (
            <section className="featured-section">
              <div className="featured-label">Featured Story</div>

              <Link href={`/posts/${featuredPost.slug || featuredPost.id}`} className="featured-card">
                <div className="featured-image">
                  {featuredPost.imageUrl ? (
                    <img src={featuredPost.imageUrl} alt={featuredPost.title} />
                  ) : (
                    <span>Thumbnail</span>
                  )}
                </div>
                <div className="featured-content">
                  
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                    {featuredPost.categories && featuredPost.categories.length > 0 ? (
                      featuredPost.categories.map((cat: any) => (
                        <span key={cat.id} className="badge">{cat.name}</span>
                      ))
                    ) : (
                      <span className="badge">Article</span>
                    )}
                  </div>
                  
                  <span className="featured-date">
                    {new Date(featuredPost.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>                  
                  <h2>{featuredPost.title}</h2>
                  <p>{featuredPost.content.replace(/<[^>]*>/g, "").slice(0, 85)}...</p>
                  
                  <p className="meta">{featuredPost.author?.name || featuredPost.author || "Admin"}</p>
                  
                  <Link href={`/posts/${featuredPost.id}`} className="read-link">
                    Read more →
                  </Link>
                </div>
              </Link>
            </section>
          )}

          <section className="latest-section">
            <div className="section-header">
              <h2>Latest</h2>
              <Link href="/posts">View all</Link>
            </div>

            <div className="article-grid">
              {latestPosts.map((post) => (
                <Link href={`/posts/${post.slug  || post.id}`} className="article-card" key={post.id}>
                  <div className="card-image">
                    {post.imageUrl ? (
                      <img src={post.imageUrl} alt={post.title} />
                    ) : (
                      <span>Thumbnail</span>
                    )}
                  </div>

                  <div className="card-content">
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                      {post.categories && post.categories.length > 0 ? (
                        post.categories.map((cat: any) => (
                          <span key={cat.id} className="badge">{cat.name}</span>
                        ))
                      ) : (
                        <span className="badge">Article</span>
                      )}
                    </div>

                    <h3>{post.title}</h3>
                    
                    <p className="meta">{post.author?.name || post.author || "Admin"} • {getReadingTime(post.content)}</p>
                    <div className="card-footer">
                      <span className="read-more">Read more →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}