import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import ArticleEditorClient from "@/components/ArticleEditorClient";
import { EditorProvider } from "@/context/EditorContext";
import ToolbarActions from "@/components/ToolbarActions";

export const metadata = {
  title: "Edit ",
};
export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  //CEK LOGIN
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const articleId = Number(params.id);

  //AMBIL DATA LAMA BERDASARKAN ID
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: { categories: true },
  });

  //cek jika tidak ada
  if (!article) {
    notFound();
  }
  if (article.userId !== session.user.id) {
    throw new Error("Unauthorized: Anda tidak berhak mengedit artikel ini.");
  }

  // Ambil semua kategori untuk ditampilkan di dropdown
  const allCategories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  //SERVER ACTION: FUNGSI UNTUK MENYIMPAN PERUBAHAN
  async function updateArticle(formData: FormData) {
    "use server";

    // Pengecekan keamanan ulang di sisi server saat tombol disubmit
    const currentSession = await getServerSession(authOptions);
    if (!currentSession || currentSession.user.id !== article?.userId) {
      throw new Error("Unauthorized");
    }

    const title = formData.get("title") as string;
    
    // Ambil semua ID Kategori yang dicentang user
    const categoryIds = formData.getAll("categoryIds").map((id) => Number(id));

    await prisma.article.update({
      where: { id: articleId },
      data: {
        title,
        imageUrl: formData.get("imageUrl") as string,
        content: formData.get("content") as string,
        
        // PERINTAH 'SET': Akan menghapus relasi kategori lama, dan memasukkan yang baru
        categories: {
          set: categoryIds.map((id) => ({ id: id })),
        },
      },
    });

    redirect("/my-page");
  }

  return (
    <EditorProvider>
      <main className="editor-page">
        <section className="editor-card">
          <div className="editor-topbar">
            <Link href="/my-page" className="editor-close">
              ×
            </Link>

            <div>
              <h2>Edit Story</h2>
              <p>Make changes to your story.</p>
            </div>
          </div>
          
          <form action={updateArticle} className="editor-form">
            <ToolbarActions />
            
            <div className="editor-body">
              {/* KITA PAKAI KOMPONEN YANG SAMA DENGAN CREATE, TAPI DIISI DATA LAMA */}
              <ArticleEditorClient 
                categories={allCategories} 
                initialTitle={article.title}
                initialContent={article.content}
                initialImageUrl={article.imageUrl || ""}
                initialSelectedCategories={article.categories}
              />
            </div>
          </form>
          
        </section>
      </main>
    </EditorProvider>
  );
}