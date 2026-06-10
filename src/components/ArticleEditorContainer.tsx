"use client";

import { useState } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import ArticleEditorClient from "@/components/ArticleEditorClient";

type Category = {
  id: number;
  name: string;
};

export default function ArticleEditorContainer({ 
  categories, 
  action 
}: { 
  categories: Category[]; 
  action: (formData: FormData) => Promise<void>; 
}) {
  const [contentHtml, setContentHtml] = useState("");

  // Inisialisasi Tiptap Editor di level penampung toolbar
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: "Tulis isi artikel di sini...",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        // Menggunakan class asli editor-content agar mewarisi layout CSS Anda
        class: "editor-content focus:outline-none w-full text-white",
      },
    },
    onUpdate: ({ editor }) => {
      setContentHtml(editor.getHTML()); // Sinkronisasi otomatis ke live preview & form submit
    },
    immediatelyRender: false,
  });

  const handleDropdownChange = (value: string) => {
    if (!editor) return;
    if (value === "paragraph") editor.chain().focus().setParagraph().run();
    if (value === "heading") editor.chain().focus().toggleHeading({ level: 2 }).run();
    if (value === "quote") editor.chain().focus().toggleBlockquote().run();
  };

  return (
    <form action={action} className="editor-form">
      {/* Input hidden untuk mengirim isi editor HTML ke Server Action database */}
      <input type="hidden" name="content" value={contentHtml} />

      {/* 100% STRUKTUR TOOLBAR ASLI ANDA SEPERTI DI PAGE.TSX SEBELUMNYA */}
      <div className="editor-toolbar">
        <button type="button" onClick={() => editor?.chain().focus().undo().run()} disabled={!editor?.can().undo()}>↶</button>
        <button type="button" onClick={() => editor?.chain().focus().redo().run()} disabled={!editor?.can().redo()}>↷</button>

        <select defaultValue="paragraph" onChange={(e) => handleDropdownChange(e.target.value)}>
          <option value="paragraph">Paragraph</option>
          <option value="heading">Heading</option>
          <option value="quote">Quote</option>
        </select>

        <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()}>B</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()}>I</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleUnderline().run()}>U</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleStrike().run()}>S</button>
        
        <button type="button" onClick={() => {
          const url = window.prompt("Masukkan URL Link:");
          if (url) editor?.chain().focus().setLink({ href: url }).run();
        }}>🔗</button>
        
        <button type="button" onClick={() => {
          const url = window.prompt("Masukkan URL Gambar:");
          if (url) editor?.chain().focus().setImage({ src: url }).run();
        }}>🖼</button>
      </div>

      {/* Mengoper objek editor dan contentHtml ke komponen input & live preview */}
      <ArticleEditorClient 
        categories={categories} 
        editor={editor} 
        contentHtml={contentHtml} 
      />
    </form>
  );
}