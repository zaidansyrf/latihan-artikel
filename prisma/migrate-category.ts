import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const articles = await prisma.article.findMany();

  for (const article of articles) {
    if (!article.category) continue;

    const category = await prisma.category.upsert({
      where: {
        name: article.category,
      },
      update: {},
      create: {
        name: article.category,
      },
    });

    await prisma.article.update({
      where: {
        id: article.id,
      },
      data: {
        categoryId: category.id,
      },
    });
  }

  console.log("Migrasi kategori selesai.");
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });