import { prisma } from "@/lib/prisma";
import { Post } from "@/types/Post";

export async function getPost(): Promise<Post[]> {
  const posts = await prisma.article.findMany({
    include: {
      categories: true,
      author: true, // <-- TAMBAHAN: Ambil data user
    },
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });

  return posts as unknown as Post[];
}

export async function getDetailPost(id: number): Promise<Post | null> {
  const post = await prisma.article.findUnique({
    where: {
      id,
    },
    include: {
      categories: true,
      author: true, // <-- TAMBAHAN: Ambil data user
    },
  });

  return post as unknown as Post;
}

export async function getAllPost(): Promise<Post[]> {
  const posts = await prisma.article.findMany({
    include: {
      categories: true,
      author: true, // <-- TAMBAHAN: Ambil data user
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return posts as unknown as Post[];
}

export async function getLastPost(): Promise<Post[]> {
  const posts = await prisma.article.findMany({
    where: {
      published: true,
    },
    include: {
      categories: true,
      author: true, // <-- TAMBAHAN: Ambil data user
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });

  return posts as unknown as Post[];
}