"use client";

import { useRouter } from "next/navigation";

type Category = {
  id: number;
  name: string;
};

export default function MobileCategoryFilter({
  categories,
  selectedCategory,
  q,
}: {
  categories: Category[];
  selectedCategory: string;
  q?: string;
}) {
  const router = useRouter();

  function handleChange(value: string) {
    const params = new URLSearchParams();

    if (q) {
      params.set("q", q);
    }

    if (value !== "all") {
      params.set("category", value);
    }

    const queryString = params.toString();

    router.push(queryString ? `/posts?${queryString}` : "/posts");
  }

  return (
    <select
      value={selectedCategory}
      onChange={(e) => handleChange(e.target.value)}
      className="mobile-filter-select"
    >
      <option value="all">Filters</option>

      {categories.map((category) => (
        <option key={category.id} value={String(category.id)}>
          {category.name}
        </option>
      ))}
    </select>
  );
}