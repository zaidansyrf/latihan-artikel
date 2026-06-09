"use client";

type Props = {
  title: string;
  author: string;
  category: string;
  imageUrl: string;
  content: string;
};

export default function ArticlePreview({
  title,
  author,
  category,
  imageUrl,
  content,
}: Props) {
  return (
    <div className="article-preview">
      <div className="preview-image">
        {imageUrl ? (
          <img src={imageUrl} alt={title} />
        ) : (
          <span>Thumbnail Preview</span>
        )}
      </div>

      <div className="preview-content">
        <span className="badge">
          {category || "Article"}
        </span>

        <h2>
          {title || "Your article title"}
        </h2>

        <p className="meta">
          By {author || "Author"}
        </p>

        <p>
          {content ||
            "Your article preview will appear here..."}
        </p>
      </div>
    </div>
  );
}