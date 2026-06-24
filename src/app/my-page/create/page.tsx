import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { generateSlug } from "@/lib/slug";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import ArticleEditorClient from "@/components/ArticleEditorClient";
import { EditorProvider } from "@/context/EditorContext";
import ToolbarActions from "@/components/ToolbarActions";

export const metadata = {
  title: "New ",
};
async function createArticle(formData: FormData) {
  "use server";

  // 1. PENGAMANAN SERVER ACTION: Wajib cek session di sini juga!
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized: Anda harus login untuk menulis artikel.");
  }

  const title = formData.get("title") as string;
  const slug = generateSlug(title);

  // 2. TANGKAP SEMUA KATEGORI: Ambil array dari checkbox dan ubah jadi angka
  const categoryIds = formData.getAll("categoryIds").map((id) => Number(id));

  await prisma.article.create({
    data: {
      title,
      slug,
      userId: session.user.id, 
      imageUrl: formData.get("imageUrl") as string,
      content: formData.get("content") as string,
      published: false,
      
      // 3. SIMPAN MANY-TO-MANY: Hubungkan artikel dengan kategori yang dipilih
      categories: {
        connect: categoryIds.map((id) => ({ id: id })),
      },
    },
  });

  redirect("/my-page");
}

export default async function CreatePostPage() {
  const session = await getServerSession(authOptions);

  // 2. Kalau nggak ada session (belum login), tendang ke halaman login bawaan NextAuth
  if (!session) {
    redirect("/api/auth/signin");
  }
  
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <EditorProvider>
      <main className="editor-page">
        <section className="editor-card">
          <div className="editor-topbar">
            <Link href="/my-page" className="editor-close">
              ×
            </Link>

            <div>
              <h2>YourStory Editor</h2>
              <p>Write and submit yours for review.</p>
            </div>
          </div>
          <form action={createArticle} className="editor-form">
            <ToolbarActions />
            <div className="editor-body">
              <ArticleEditorClient categories={categories} />
            </div>
          </form>
        </section>
      </main>
    </EditorProvider>
  );
}