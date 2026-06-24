import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AdminEditForm from "./AdminEditForm"; 

export default async function AdminEditPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const articleId = Number(params.id);

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: { categories: true }, 
  });

  if (!article) return notFound();

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  async function updateArticle(formData: FormData) {
    "use server";
    
    try {
      const session = await getServerSession(authOptions);
      if (!session) throw new Error("Unauthorized");

      const title = formData.get("title") as string;
      const content = formData.get("content") as string;
      const author = formData.get("author") as string;
      const categoryIds = formData.getAll("categories").map(Number);

      await prisma.article.update({
        where: { id: articleId },
        data: {
          title,
          content,
          // HAPUS BARIS author: author di sini karena memicu error relasi User
          categories: {
            set: [], 
            connect: categoryIds.map((id) => ({ id })), 
          },
        },
      });
    } catch (error) {
      console.error("GAGAL UPDATE ARTIKEL:", error);
      throw error;
    }

    redirect("/admin/articles");
  }

  return <AdminEditForm article={article} categories={categories} saveAction={updateArticle} />;
}