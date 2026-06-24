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

//PROPS INITIAL DATA UNTUK KEBUTUHAN EDIT
export default function ArticleEditorClient({
  categories,
  initialTitle = "",
  initialContent = "",
  initialImageUrl = "",
  initialSelectedCategories = [],
}: {
  categories: Category[];
  initialTitle?: string;
  initialContent?: string;
  initialImageUrl?: string;
  initialSelectedCategories?: Category[];
}) {
  const { setEditor } = useSharedEditor();
  
  //MASUKKAN INITIAL DATA KE DALAM STATE
  const [title, setTitle] = useState(initialTitle);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(initialSelectedCategories);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [contentHtml, setContentHtml] = useState(initialContent);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: "Tulis isi artikel di sini...",
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "editor-content focus:outline-none w-full text-white",
      },
    },
    onUpdate: ({ editor }) => {
      setContentHtml(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor) {
      setEditor(editor);
    }
  }, [editor, setEditor]);

  const cleanPlainText = contentHtml.replace(/<[^>]*>/g, "");

  const maxLimit = 8;
  const isAllSelected = selectedCategories.length > 0 && (selectedCategories.length === categories.length || selectedCategories.length === maxLimit);
  const isIndeterminate = selectedCategories.length > 0 && !isAllSelected;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMasterCheckboxChange = () => {
    if (isAllSelected || isIndeterminate) {
      setSelectedCategories([]); 
    } else {
      setSelectedCategories(categories.slice(0, maxLimit));
    }
  };

  const handleCategoryChange = (category: Category) => {
    const isSelected = selectedCategories.some((c) => c.id === category.id);
    
    if (isSelected) {
      setSelectedCategories((prev) => prev.filter((c) => c.id !== category.id));
    } else {
      if (selectedCategories.length >= maxLimit) {
        alert(`Maksimal ${maxLimit} kategori yang dapat dipilih.`);
        return;
      }
      setSelectedCategories((prev) => [...prev, category]);
    }
  };

  return (
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

        <div className="editor-meta-row" style={{ position: "relative" }}>
          {selectedCategories.map((cat) => (
            <input key={`hidden-${cat.id}`} type="hidden" name="categoryIds" value={cat.id} />
          ))}

          <div className="custom-category-dropdown">
            <div 
              className={`dropdown-trigger ${isDropdownOpen ? 'open' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="master-checkbox-wrapper" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  className="checkbox-input"
                  ref={(el) => { if (el) el.indeterminate = isIndeterminate; }}
                  checked={isAllSelected}
                  onChange={handleMasterCheckboxChange}
                />
              </div>
              <span className="dropdown-label">Pilih kategori ({selectedCategories.length}/{maxLimit})</span>
              <span className="dropdown-icon">{isDropdownOpen ? "ᐱ" : "ᐯ"}</span>
            </div>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                {categories.map((category) => (
                  <label key={category.id} className="dropdown-item">
                    <input
                      type="checkbox"
                      className="checkbox-input"
                      checked={selectedCategories.some(c => c.id === category.id)}
                      onChange={() => handleCategoryChange(category)}
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 4. PASSING GAMBAR LAMA KE UPLOADER BIAR MUNCUL PREVIEWNYA */}
        <ImageUploadField 
          onUploadComplete={setImageUrl} 
          initialPreview={imageUrl} 
        />
        <input type="hidden" name="imageUrl" value={imageUrl} />
        <input type="hidden" name="content" value={contentHtml} />

        <EditorContent editor={editor} />

        <button type="submit" className="editor-submit">
          Save Changes
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
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
              {selectedCategories.length > 0 ? (
                selectedCategories.map((cat) => (
                  <span key={`badge-${cat.id}`} className="badge">{cat.name}</span>
                ))
              ) : (
                <span className="badge">Article</span>
              )}
            </div>
            <h2>{title || "Your title here"}</h2>
             <p>
              {cleanPlainText
                ? cleanPlainText.slice(0, 140) + (cleanPlainText.length > 140 ? "..." : "")
                : "Your contents will appear here..."}
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}