import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { generateSlug } from "@/lib/slug";
import Link from "next/link";
import ImageUploadField from "@/components/ImageUploadField";
import ArticleEditorClient from "@/components/ArticleEditorClient";

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
    <main className="editor-page">
      <section className="editor-card">
        <div className="editor-topbar">
          <Link href="/" className="editor-close">
            ×
          </Link>

          <div>
            <h2>MyArticles Editor</h2>
            <p>Write and submit your article for review.</p>
          </div>
        </div>

        <form action={createArticle} className="editor-form">
          <div className="editor-toolbar">
            <button type="button">↶</button>
            <button type="button">↷</button>

            <select defaultValue="paragraph">
              <option value="paragraph">Paragraph</option>
              <option value="heading">Heading</option>
              <option value="quote">Quote</option>
            </select>

            <button type="button">B</button>
            <button type="button">I</button>
            <button type="button">U</button>
            <button type="button">S</button>
            <button type="button">🔗</button>
            <button type="button">🖼</button>
          </div>

          <div className="editor-body">
              <ArticleEditorClient categories={categories} />
          </div>
        </form>
      </section>
    </main>
  );
}