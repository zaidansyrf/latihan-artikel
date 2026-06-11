"use client";

import { useState, useRef } from "react";

export default function ImageUploadField({
  onUploadComplete,
}: {
  onUploadComplete?: (url: string) => void;
}) {
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  
  // Menggunakan ref untuk mengontrol input file dari luar label
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setImageUrl(data.imageUrl);
    setPreview(data.imageUrl);
    onUploadComplete?.(data.imageUrl);

    setUploading(false);
  }

  // Fungsi khusus untuk menghapus/mereset gambar yang sudah dipilih
  const handleRemoveImage = (e: React.MouseEvent) => {
    e.preventDefault();   // Mencegah aksi bawaan form submit
    e.stopPropagation();  // Mencegah click event tembus ke label/box upload gambar

    setImageUrl("");
    setPreview("");
    onUploadComplete?.(""); // Mengirim string kosong ke parent agar live preview ikut terhapus

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Membersihkan sisa riwayat file di input HTML
    }
  };

  return (
    <div className="image-upload-field">
      <input type="hidden" name="imageUrl" value={imageUrl} />

      {/* Menambahkan position relative lewat style inline atau css biar tombol silang melayang pas */}
      <div className="image-upload-box" style={{ position: "relative" }} onClick={() => fileInputRef.current?.click()}>
        {preview ? (
          <>
            <img src={preview} alt="Preview thumbnail" />
            
            {/* TOMBOL SILANG UNTUK MENGHAPUS GAMBAR */}
            <button
              type="button"
              onClick={handleRemoveImage}
              className="remove-image-btn"
              title="Hapus gambar"
            >
              ×
            </button>
          </>
        ) : (
          <span>Choose thumbnail image</span>
        )}
      </div>

      {/* Input dilepas di luar box agar klik tombol hapus tidak memicu jendela pencarian file */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleUpload(file);
          }
        }}
      />

      {uploading && <p>Uploading image...</p>}
    </div>
  );
}