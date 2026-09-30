export default function LibraryCard({
  type,
  title,
  description,
  meta,
  xp,
  onClick,
}) {
  return (
    <article
      className="library-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          onClick?.();
        }
      }}
    >
      <div className="library-card-type">
        {type}
      </div>

      <h2 className="library-card-title">
        {title}
      </h2>

      <p className="library-card-description">
        {description}
      </p>

      <div className="library-card-footer">
        <span className="library-card-meta">
          {meta}
        </span>

        <span className="library-card-xp">
          {xp}
        </span>
      </div>
    </article>
  );
}