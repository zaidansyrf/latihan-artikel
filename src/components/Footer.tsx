import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>YourStory</h3>
          <p>
            Write, Share, and Read your own Story. Pour out all your thoughts and stories that you want to convey for free without joining
          </p>
        </div>

        <div className="footer-links">
          <h4>Navigation</h4>

          <Link href="/">Home</Link>
          <Link href="/posts">Story</Link>
          <Link href="/about">About</Link>
        </div>

        <div className="footer-info">
          <h4>Information</h4>

          <p>A simple website built for learning while have fun. this website still under development. Enjoy</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} YourStory. All rights reserved.
        </p>
      </div>
    </footer>
  );
}