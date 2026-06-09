export const metadata = {
  title: "About",
  description: "Learn more about YourStory and the purpose of this project.",
};
export default function AboutPage() {
  return (
    <main className="about-page-new">
      <section className="about-intro">
        <div className="about-shape-square"></div>

        <div className="about-text about-text-intro">
          <h1>ABOUT</h1>
          <span className="about-dot"></span>
          <p>
            To provide a clean and modern platform where everyone can publish
            and share their stories.
          </p>
        </div>
      </section>

  <section className="about-vision">
  <h2>VISION</h2>

  <div className="about-vision-content">
    <p>Modern & Colourfull Design</p>
    <p>Responsive Design</p>
  </div>
</section>

      <section className="about-tech">
        <div className="about-text">
          <h2>TECH STACK</h2>
          <div className="tech-list-new">
            <span>Next.js</span>
            <span>Prisma</span>
            <span>TypeScript</span>
            <span>SQLite</span>
          </div>
        </div>

        <div className="about-shape-side"></div>
      </section>
    </main>
  );
}