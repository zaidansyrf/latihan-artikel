"use client";

import { useState, useRef } from "react";

export default function ImageUploadField({
  onUploadComplete,
  initialPreview = "", // 1. Menerima gambar bawaan untuk halaman Edit
}: {
  onUploadComplete?: (url: string) => void;
  initialPreview?: string;
}) {
  const [imageUrl, setImageUrl] = useState(initialPreview);
  const [preview, setPreview] = useState(initialPreview);
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload gagal");

      const data = await res.json();

      setImageUrl(data.imageUrl);
      setPreview(data.imageUrl);
      onUploadComplete?.(data.imageUrl); // Sinkronisasi ke form utama
    } catch (error) {
      alert("Terjadi kesalahan saat mengunggah gambar.");
    } finally {
      setUploading(false);
    }
  }

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.preventDefault();   
    e.stopPropagation();  

    setImageUrl("");
    setPreview("");
    onUploadComplete?.(""); // Memberitahu form utama bahwa gambar dihapus

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  return (
    <div className="image-upload-field">
      {/* 2. INPUT HIDDEN TELAH DIHAPUS DARI SINI AGAR TIDAK BENTROK */}

      <div className="image-upload-box" style={{ position: "relative" }} onClick={() => fileInputRef.current?.click()}>
        {preview ? (
          <>
            <img src={preview} alt="Preview thumbnail" />
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

      {uploading && <p style={{ fontSize: "14px", marginTop: "8px" }}>Uploading image...</p>}
    </div>
  );
}