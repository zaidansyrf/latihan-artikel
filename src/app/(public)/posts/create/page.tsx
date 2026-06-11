import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { generateSlug } from "@/lib/slug";
import Link from "next/link";
import ArticleEditorClient from "@/components/ArticleEditorClient";
import { EditorProvider } from "@/context/EditorContext";
import ToolbarActions from "@/components/ToolbarActions";

async function createArticle(formData: FormData) {
  "use server";

  const title = formData.get("title") as string;
  const slug = generateSlug(title);

  await prisma.article.create({
    data: {
      title,
      slug,
      author: formData.get("author") as string,
      categoryId: Number(formData.get("categoryId")),
      imageUrl: formData.get("imageUrl") as string,
      content: formData.get("content") as string,
      published: false,
    },
  });

  redirect("/posts");
}

export default async function CreatePostPage() {
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
            <Link href="/" className="editor-close">
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