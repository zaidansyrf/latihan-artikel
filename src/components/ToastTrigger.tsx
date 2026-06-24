"use client";

import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ToastTrigger() {
  useEffect(() => {
    // 1. Panggil custom toast
    toast.custom(
      (t) => (
        <div
          className={`custom-toast-container ${
            t.visible ? "toast-enter" : "toast-leave"
          }`}
        >
          <div className="custom-toast-body">
            {/* Icon Checkmark SVG */}
            <svg
              className="custom-toast-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>

            <p className="custom-toast-text">
              <strong>YourStory</strong> berhasil dibuat,<br />
              silakan menunggu untuk di review
            </p>
          </div>

          {/* Garis Progress Bar yang mengecil */}
          <div className="custom-toast-progress"></div>
        </div>
      ),
      {
        duration: 4000, // Toast akan tampil selama 4 detik
        position: "top-right", 
      }
    );

    // 2. Trik Ninja: Bersihkan URL dari ?success=true secara diam-diam
    // Ini tidak akan memicu re-render, sehingga Toast punya waktu 4 detik untuk selesai
    window.history.replaceState(null, '', '/my-page');

  }, []);

  // Toaster wajib dirender agar toast.custom() bisa muncul
  return <Toaster 
      containerStyle={{
        top: '90px',
        right: '20px', 
      }}
    />
}