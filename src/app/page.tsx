import Image from "next/image";
import Link from "next/link";
import {getLastPost} from "@/lib/api";
import PostList from "@/components/PostList";

export default async function Home() {
  const posts = await getLastPost();
  return (
    <>
    <div className="main-heading">
      <h2>Welcome, to MyArticles</h2>
      <p>This website is just for my practice, no CRUD (maybe i'll add it later)</p>
    </div>
    <PostList posts={posts}/>
    <Link href="/posts" className="view-more">view more</Link>
    </>
    
  );
}
