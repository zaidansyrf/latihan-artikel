import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function createCategory(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;

  await prisma.category.create({
    data: {
      name,
    },
  });

  revalidatePath("/admin/categories");
}

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Kelola Kategori</h1>
          <p>Tambah dan kelola kategori artikel.</p>
        </div>
      </div>

      <form action={createCategory} className="admin-form">
        <input
          name="name"
          placeholder="Nama kategori"
          required
        />

        <button type="submit" className="admin-primary-btn">
          Tambah Kategori
        </button>
      </form>

      <section className="admin-section">
        <h2>Daftar Kategori</h2>

        <div className="admin-category-list">
          {categories.map((category) => (
            <div className="admin-category-item" key={category.id}>
              <span>{category.name}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}