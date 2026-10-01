export function LibraryScreen() {
  const items = [
    ["Attend Career Workshop", "Challenge", "Moderate · 2 hrs", "~120 XP"],
    ["Upload Resume Draft", "Activity", "Easy · 30 min", "~45 XP"],
    ["Portfolio Sprint Challenge", "Challenge", "Hard · one week", "~275 XP"],
    [
      "Complete Employer Assessment",
      "Activity",
      "Difficult · 3 hrs",
      "~250 XP",
    ],
  ];
  return (
    <div>
      <div className="portal-heading">
        <p>LIBRARY</p>
        <h1>Activities & Challenges</h1>
        <span>Choose a template or create a task from scratch.</span>
      </div>
      <div className="portal-library-grid">
        {items.map((x) => (
          <article key={x[0]}>
            <small>{x[1]}</small>
            <h2>{x[0]}</h2>
            <p>Approved prototype template ready for configuration.</p>
            <div>
              <span>{x[2]}</span>
              <b>{x[3]}</b>
            </div>
            <button>Use template</button>
          </article>
        ))}
      </div>
    </div>
  );
}
