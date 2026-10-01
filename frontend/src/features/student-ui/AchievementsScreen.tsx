export function AchievementsScreen({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const data = [
    ["★", "Career Starter", "Complete your first career activity", "Unlocked"],
    ["⌘", "Secure Builder", "Complete a cybersecurity challenge", "Unlocked"],
    ["◆", "Portfolio Builder", "Complete five portfolio activities", "2 / 5"],
    [
      "✦",
      "Community Contributor",
      "Complete three collaborative activities",
      "1 / 3",
    ],
    ["♛", "Skill Specialist", "Reach Level 5 in any skill", "Unlocked"],
  ];
  return (
    <div className={embedded ? "achievements-embedded" : "student-page"}>
      {!embedded && (
        <div className="screen-title">
          <p>YOUR COLLECTION</p>
          <h1>Achievements</h1>
          <span>
            Achievements can award bonus XP and unlock avatar or hub rewards.
          </span>
        </div>
      )}
      <div className="achievement-grid-native">
        {data.map((a, i) => (
          <article className={a[3] === "Unlocked" ? "unlocked" : ""} key={a[1]}>
            <div className={`achievement-icon a${i}`}>{a[0]}</div>
            <h2>{a[1]}</h2>
            <p>{a[2]}</p>
            <span>{a[3]}</span>
            {a[3] === "Unlocked" && <small>Cosmetic reward available</small>}
          </article>
        ))}
      </div>
    </div>
  );
}
