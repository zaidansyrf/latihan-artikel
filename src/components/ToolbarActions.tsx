"use client";

import { useSharedEditor } from "@/context/EditorContext";
import { useEffect, useState } from "react";

export default function ToolbarActions() {
  const { editor } = useSharedEditor();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    if (!editor) return;

    // Fungsi sensor untuk mengecek riwayat setiap kali ada ketikan/perubahan
    const updateState = () => {
      setCanUndo(editor.can().undo());
      setCanRedo(editor.can().redo());
    };

    // Pasang sensor ke mesin Tiptap
    editor.on("transaction", updateState);

    // Bersihkan sensor jika komponen dilepas
    return () => {
      editor.off("transaction", updateState);
    };
  }, [editor]);
  const handleDropdownChange = (value: string) => {
    if (!editor) return;
    if (value === "paragraph") editor.chain().focus().setParagraph().run();
    if (value === "heading") editor.chain().focus().toggleHeading({ level: 2 }).run();
    if (value === "quote") editor.chain().focus().toggleBlockquote().run();
  };

  return (
    /* 100% STRUKTUR TOOLBAR ASLI BAWAAN LU */
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
  );
}