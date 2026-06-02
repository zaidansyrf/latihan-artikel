import Image from "next/image";
import Link from "next/link";
import {getAllPost} from "@/lib/api";
import PostList from "@/components/PostList";

export default async function Page() {
  const posts = await getAllPost();
  return (
    <>
    <div className="main-heading">
      <h2>List Post</h2>
    </div>
    <PostList posts={posts}/>
    </>
    
  );
}
