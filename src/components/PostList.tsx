import Link from "next/link";
import {Post} from "@/types/Post";

 interface PostListProps{
  posts:Post[]
 }
function PostList({posts}: PostListProps) {
  return (
    <div className="post-list">
      {
      posts.map((post)=>(
        <div className="post-item" key={post.id}>
          <h3>
            <Link href={`/posts/${post.id}`}>
              {post.title}
            </Link>
          </h3>
        </div>
      ))
      }
    </div>
  )
}

export default PostList