"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteArticle(formData: FormData) {
  const id = Number(formData.get("id"));

  await prisma.article.delete({
    where: { id },
  });

  revalidatePath("/posts");
}