"use client";

import Link from "next/link";

export default function PublicErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="error-page">
      <div className="error-card">
        <span>Oops!</span>

        <h1>Something went wrong</h1>

        <p>
          Terjadi kesalahan saat memuat halaman. Silakan coba lagi atau kembali
          ke halaman utama.
        </p>

        <div className="error-actions">
          <button onClick={() => reset()} className="error-btn">
            Try again
          </button>

          <Link href="/" className="error-link">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}