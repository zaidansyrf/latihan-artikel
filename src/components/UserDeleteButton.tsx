"use client";

import { deleteArticle } from "@/app/actions/articleActions";

export default function DeleteButton({ id }: { id: number }) {
  const handleDelete = async () => {
    const isConfirmed = window.confirm("Yakin ingin menghapus artikel ini? Data tidak bisa dikembalikan.");
    
    if (isConfirmed) {
      try {
        await deleteArticle(id);
      } catch (error) {
        console.error("Gagal menghapus:", error);
        alert("Terjadi kesalahan.");
      }
    }
  };

  return (
    <button onClick={handleDelete} className="btn-action delete">
      Delete
    </button>
  );
}