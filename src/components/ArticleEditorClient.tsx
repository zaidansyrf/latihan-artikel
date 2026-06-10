"use client";

import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import ImageUploadField from "@/components/ImageUploadField";
import { useSharedEditor } from "@/context/EditorContext";

type Category = {
  id: number;
  name: string;
};

export default function ArticleEditorClient({
  categories,
}: {
  categories: Category[];
}) {
  const { setEditor } = useSharedEditor();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const cleanPlainText = contentHtml.replace(/<[^>]*>/g, "");

  // Inisialisasi Tiptap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: "Start wrote your story...",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        // Mengikat langsung ke class asli editor-content Anda agar gayanya presisi
        class: "editor-content focus:outline-none w-full text-white",
      },
    },
    onUpdate: ({ editor }) => {
      setContentHtml(editor.getHTML()); // Sinkronisasi teks ke Live Preview
    },
    immediatelyRender: false,
  });

  // Daftarkan mesin editor ke Context Share tingkat atas agar Toolbar bisa mengaksesnya
  useEffect(() => {
    if (editor) {
      setEditor(editor);
    }
  }, [editor, setEditor]);

  return (
    /* 100% STRUKTUR LAYOUT INPUT AREA & LIVE PREVIEW KODE ASLI LAMA ANDA */
    <div className="editor-preview-layout">
      <div className="editor-input-area">
        <input
          name="title"
          className="editor-title"
          placeholder="Title here"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="editor-meta-row">
          <input
            name="author"
            placeholder="Author name"
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

        {/* Input hidden untuk mengirim data string HTML Tiptap ke Server Action database */}
        <input type="hidden" name="content" value={contentHtml} />

        {/* Editor Tiptap menggantikan posisi textarea lama lu secara akurat */}
        <EditorContent editor={editor} />

        <button type="submit" className="editor-submit">
          Submit
        </button>
      </div>

      {/* ASIDE LIVE PREVIEW ASLI MILIK LU */}
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

            <h2>{title || "Your title here"}</h2>
          <p>
              {cleanPlainText
                ? cleanPlainText.slice(0, 140) + (cleanPlainText.length > 140 ? "..." : "")
                : "Your article preview will appear here..."}
            </p>
            <p className="meta">By {author || "Author"}</p>
          </div>
        </div>
      </aside>
    </div>
  );
}