import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminCreateForm from "./AdminCreateForm";
import { writeFile } from "fs/promises";
import path from "path";

export default async function AdminCreatePage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  async function saveArticle(formData: FormData) {
    "use server";
    
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const categoryIds = formData.getAll("categories").map(Number);
    
    // 1. Tangkap file gambar dari form
    const imageFile = formData.get("image") as File | null;
    let imageUrl = null;

    // 2. Jika ada gambar yang diupload, simpan ke folder public/uploads
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Buat nama file unik agar tidak bentrok
      const fileName = `${Date.now()}-${imageFile.name.replace(/\s/g, '-')}`;
      const uploadPath = path.join(process.cwd(), "public", "uploads", fileName);
      
      await writeFile(uploadPath, buffer);
      imageUrl = `/uploads/${fileName}`; // URL ini yang masuk ke database
    }

    // 3. Simpan data ke Database
    await prisma.article.create({
      data: {
        title,
        content,
        published: true,
        imageUrl, // Masukkan URL gambar ke kolom database
        categories: {
          connect: categoryIds.map((id) => ({ id })),
        },
      },
    });

    redirect("/admin/articles");
  }

  return <AdminCreateForm categories={categories} saveAction={saveArticle} />;
}