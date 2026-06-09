"use client";

export default function DeleteArticleConfirm() {
  return (
    <button
      type="submit"
      className="admin-danger-btn"
      onClick={(e) => {
        const confirmed = confirm(
          "Yakin ingin menghapus artikel ini?"
        );

        if (!confirmed) {
          e.preventDefault();
        }
      }}
    >
      Delete
    </button>
  );
}