import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <span>404</span>

        <h1>Page Not Found</h1>

        <p>
          Halaman yang kamu cari tidak ditemukan atau sudah dipindahkan.
        </p>

        <Link href="/" className="not-found-btn">
          Back to Home
        </Link>
      </div>
    </main>
  );
}