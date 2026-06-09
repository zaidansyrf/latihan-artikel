import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";

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

  redirect("/admin/posts");
}

export default async function EditAdminPostPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);

  const post = await prisma.article.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  return (
    <main>
      <h1>Edit Artikel</h1>

      <form action={updateArticle.bind(null, id)}>
        <input name="title" defaultValue={post.title} required />
        <input name="author" defaultValue={post.author} required />
        <input name="category" defaultValue={post.category || ""} />
        <input name="imageUrl" defaultValue={post.imageUrl || ""} />

        <textarea name="content" defaultValue={post.content} required />

        <label>
          <input
            type="checkbox"
            name="published"
            defaultChecked={post.published}
          />
          Published
        </label>

        <button type="submit">Update</button>
      </form>
    </main>
  );
}