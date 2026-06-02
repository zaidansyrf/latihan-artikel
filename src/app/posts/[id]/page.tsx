import React from 'react';
import Link from 'next/link';
import {getDetailPost} from '@/lib/api';


interface PageProps {
  params: {
    id: string;
  };
}

async function page({ params }: PageProps) {
  const { id } = params;
  const post = await getDetailPost(Number(id));
  return (
    <>
    <div className="post-detail">
      <h3>{post.title}</h3>
      <div className="content">{post.body}</div>
    </div>
      <Link href="/posts" className="back-link">
        Back to list
      </Link>
    </>
    
  );
}

export default page