import { prisma } from "@/lib/prisma";
import { Post } from "@/types/Post";

export async function getPost(): Promise<Post[]> {
  const posts = await prisma.article.findMany({
    include: {
      categoryRel: true,
    },
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });

  return posts;
}

export async function getDetailPost(id: number): Promise<Post | null> {
  const post = await prisma.article.findUnique({
    where: {
      id,
    },
    include: {
      categoryRel: true,
    },
  });

  return post;
}

export async function getAllPost(): Promise<Post[]> {
  const posts = await prisma.article.findMany({
    include: {
      categoryRel: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return posts;
}
export async function getLastPost(): Promise<Post[]> {
  const posts = await prisma.article.findMany({
    where: {
      published: true,
    },
    include: {
      categoryRel: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });

  return posts;
}