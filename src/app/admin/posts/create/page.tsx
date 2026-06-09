import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function createArticle(formData: FormData) {
  "use server";

  await prisma.article.create({
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

export default function CreateAdminPostPage() {
  return (
    <main>
      <h1>Tambah Artikel</h1>

      <form action={createArticle}>
        <input name="title" placeholder="Judul artikel" required />
        <input name="author" placeholder="Nama penulis" required />
        <input name="category" placeholder="Kategori" />
        <input name="imageUrl" placeholder="URL gambar" />
        <textarea name="content" placeholder="Isi artikel" required />

        <label>
          <input type="checkbox" name="published" defaultChecked />
          Published
        </label>

        <button type="submit">Simpan</button>
      </form>
    </main>
  );
}