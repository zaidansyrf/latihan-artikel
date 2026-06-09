"use client";

import { useState } from "react";
import ImageUploadField from "@/components/ImageUploadField";

type Category = {
  id: number;
  name: string;
};

export default function ArticleEditorClient({
  categories,
}: {
  categories: Category[];
}) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  return (
    <div className="editor-preview-layout">
      <div className="editor-input-area">
        <input
          name="title"
          className="editor-title"
          placeholder="Judul artikel"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="editor-meta-row">
          <input
            name="author"
            placeholder="Nama penulis"
            required
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <select
            name="categoryId"
            required
            defaultValue=""
            onChange={(e) => {
              const selected = categories.find(
                (category) => String(category.id) === e.target.value
              );

              setCategoryName(selected?.name || "");
            }}
          >
            <option value="" disabled>
              Pilih kategori
            </option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <ImageUploadField onUploadComplete={setImageUrl} />

        <textarea
          name="content"
          className="editor-content"
          placeholder="Tulis isi artikel di sini..."
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button type="submit" className="editor-submit">
          Submit for Review
        </button>
      </div>

      <aside className="article-live-preview">
        <p className="preview-label">Live Preview</p>

        <div className="preview-card">
          <div className="preview-image">
            {imageUrl ? (
              <img src={imageUrl} alt={title || "Preview"} />
            ) : (
              <span>Thumbnail Preview</span>
            )}
          </div>

          <div className="preview-content">
            <span className="badge">{categoryName || "Article"}</span>

            <h2>{title || "Your article title"}</h2>

            <p className="meta">By {author || "Author"}</p>

            <p>
              {content
                ? content.slice(0, 140) + "..."
                : "Your article preview will appear here..."}
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}