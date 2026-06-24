"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminEditForm({ 
  article, 
  categories, 
  saveAction 
}: { 
  article: any; 
  categories: any[]; 
  saveAction: (formData: FormData) => void 
}) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const initialCategoryIds = article.categories?.map((c: any) => c.id) || [];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCats, setSelectedCats] = useState<number[]>(initialCategoryIds);

  const handleCatToggle = (id: number) => {
    if (selectedCats.includes(id)) {
      setSelectedCats(selectedCats.filter((c) => c !== id));
    } else {
      if (selectedCats.length >= 8) {
        alert("Maksimal hanya boleh memilih 8 kategori!");
        return;
      }
      setSelectedCats([...selectedCats, id]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };
  const removeImage = () => setImagePreview(null);

  const applyFormat = (openTag: string, closeTag: string) => {
    const textarea = document.getElementById("admin-editor-content") as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = openTag + selected + closeTag;
    
    textarea.focus();
    if (!document.execCommand("insertText", false, replacement)) {
      textarea.value = text.substring(0, start) + replacement + text.substring(end, text.length);
    }
    textarea.setSelectionRange(start + openTag.length, start + openTag.length + selected.length);
  };

  const handleHeading = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "h1") applyFormat("<h1>", "</h1>");
    if (val === "h2") applyFormat("<h2>", "</h2>");
    if (val === "h3") applyFormat("<h3>", "</h3>");
    e.target.value = "normal";
  };

  return (
    <main className="editor-page">
      <div className="editor-card" style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        <div className="editor-topbar">
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Edit Artikel</h2>
            <p>Perbarui konten artikel ini.</p>
          </div>
          <Link href="/admin/articles" className="admin-secondary-btn" style={{ marginLeft: "auto" }}>
            Batal
          </Link>
        </div>

        <div className="editor-toolbar">
          <button type="button" onClick={() => document.execCommand("undo")} title="Undo">↩️</button>
          <button type="button" onClick={() => document.execCommand("redo")} title="Redo">↪️</button>
          <div style={{ width: "1px", height: "24px", background: "#e5e7eb", margin: "0 8px" }}></div>

          <select onChange={handleHeading} style={{ padding: "6px", borderRadius: "6px", border: "1px solid #ddd", cursor: "pointer" }}>
            <option value="normal">Normal Text</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>
          <button type="button" onClick={() => applyFormat("<b>", "</b>")} style={{ fontWeight: "bold" }}>B</button>
          <button type="button" onClick={() => applyFormat("<i>", "</i>")} style={{ fontStyle: "italic" }}>I</button>
          <button type="button" onClick={() => applyFormat("<u>", "</u>")} style={{ textDecoration: "underline" }}>U</button>
          <div style={{ width: "1px", height: "24px", background: "#e5e7eb", margin: "0 8px" }}></div>
          <button type="button" onClick={() => {
            const url = prompt("Masukkan URL Link:");
            if (url) applyFormat(`<a href="${url}" target="_blank" style="color: #0891b2; text-decoration: underline;">`, `</a>`);
          }}>🔗 Link</button>
          <button type="button" onClick={() => applyFormat('<img src="URL_GAMBAR" style="max-width: 100%; border-radius: 12px; margin: 16px 0;" />', '')}>📷 Image</button>
        </div>

        <form action={saveAction} className="editor-body" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div className="image-upload-field">
            <label className="preview-label">Cover Image</label>
            <label className="image-upload-box" style={{ position: "relative" }}>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview || article.imageUrl ? (
                <>
                  <img src={imagePreview || article.imageUrl} alt="Preview" />
                  <button type="button" className="remove-image-btn" onClick={(e) => { e.preventDefault(); removeImage(); article.imageUrl = ""; }}>&times;</button>
                </>
              ) : (<span>+ Klik untuk Upload Gambar</span>)}
            </label>
          </div>

          <input type="text" name="title" defaultValue={article.title} className="editor-title" required />

          <div className="editor-meta-row" style={{ display: "flex", gap: "16px", zIndex: 10 }}>
            <input type="text" name="author" defaultValue={article.author} className="editor-image-input" style={{ flex: 1 }} />
            
            <div className="custom-category-dropdown" style={{ flex: 1, margin: 0, maxWidth: "100%" }}>
              <div className={`dropdown-trigger ${isDropdownOpen ? "open" : ""}`} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <span className="dropdown-label">
                  {selectedCats.length > 0 ? `${selectedCats.length} Kategori Dipilih` : "Pilih Kategori (Maks 8)"}
                </span>
                <span className="dropdown-icon">▼</span>
              </div>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  {categories.map((cat) => (
                    <label key={cat.id} className="dropdown-item">
                      <input 
                        type="checkbox" 
                        className="checkbox-input"
                        checked={selectedCats.includes(cat.id)}
                        onChange={() => handleCatToggle(cat.id)}
                      />
                      {cat.name}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {selectedCats.map((id) => (
            <input key={id} type="hidden" name="categories" value={id} />
          ))}

          <textarea
            id="admin-editor-content"
            name="content"
            defaultValue={article.content}
            className="editor-content"
            required
            style={{ minHeight: "400px", padding: "16px", border: "1px solid #e5e7eb", borderRadius: "16px" }}
          />

          <button type="submit" className="editor-submit" style={{ alignSelf: "flex-start" }}>Simpan Perubahan</button>
        </form>
      </div>
    </main>
  );
}