"use client";

import { useState } from "react";

export default function ImageUploadField({
  onUploadComplete,
}: {
  onUploadComplete?: (url: string) => void;
}) {
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

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

  return (
    <div className="image-upload-field">
      <input type="hidden" name="imageUrl" value={imageUrl} />

      <label className="image-upload-box">
        {preview ? (
          <img src={preview} alt="Preview thumbnail" />
        ) : (
          <span>Choose thumbnail image</span>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              handleUpload(file);
            }
          }}
        />
      </label>

      {uploading && <p>Uploading image...</p>}
    </div>
  );
}