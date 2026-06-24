"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function deleteArticle(articleId: number) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  // Hapus artikel berdasarkan ID
  await prisma.article.delete({
    where: { id: articleId },
  });

  // Refresh halaman My Page otomatis setelah dihapus
  revalidatePath("/my-page");
}