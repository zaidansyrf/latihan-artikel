import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

async function updateArticle(id: number, formData: FormData) {
  "use server";

  await prisma.article.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      category: formData.get("category") as string,
      imageUrl: formData.get("imageUrl") as string,
      content: formData.get("content") as string,
      published: formData.get("published") === "on",
    },
  });

  redirect("/admin/articles");
}

export default async function EditAdminArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);

  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    notFound();
  }

  return (
    <main className="admin-page">
      <h1>Edit Artikel</h1>

      <form action={updateArticle.bind(null, id)} className="admin-form">
        <input name="title" defaultValue={article.title} required />
        <input name="author" defaultValue={article.author} required />
        <input name="category" defaultValue={article.category || ""} />
        <input name="imageUrl" defaultValue={article.imageUrl || ""} />

        <textarea
          name="content"
          defaultValue={article.content}
          required
        />

        <label className="admin-checkbox">
          <input
            type="checkbox"
            name="published"
            defaultChecked={article.published}
          />
          Published
        </label>

        <button type="submit" className="admin-primary-btn">
          Simpan Perubahan
        </button>
      </form>
    </main>
  );
}