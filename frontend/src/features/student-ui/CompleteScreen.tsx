import type { CompletionView } from "./StudentExperience";
export function CompleteScreen({
  completion,
  onViewProgress,
  onFindAnother,
}: {
  completion: CompletionView;
  onViewProgress: () => void;
  onFindAnother: () => void;
}) {
  const { activity, result } = completion;
  const total = result.total_xp ?? 0;
  const level = result.current_level ?? 1;

  const previous =
    result.previous_level ?? Math.max(1, level - (result.level_up ? 1 : 0));
  const progressPercent = result.level_progress_percent ?? 0;
  const nextLevel = result.next_level;
  const nextLevelXP = result.next_level_xp;
  const xpToGo = result.xp_to_next_level ?? 0;
  const isMaxLevel = result.is_max_level ?? false;
  const skills = result.skill_xp_awarded ?? [];
  const cosmetics = (result.cosmetics_unlocked ?? []) as {
    code?: string;
    name?: string;
    slot?: string;
  }[];
  return (
    <div className="complete-screen">
      <section className="complete-hero">
        <div className="complete-check">
          <span className="material-symbols-outlined">check</span>
        </div>
        <p>CHALLENGE COMPLETED</p>
        <h1>{activity.title}</h1>
        <strong>+{result.activity_xp ?? activity.final_xp} XP</strong>
        <span>earned · verified completion</span>
      </section>
      <main className="complete-content">
        {skills.length > 0 && (
          <section className="complete-card">
            <h2>Skills developed</h2>
            {skills.map((s) => (
              <div className="complete-row" key={s.skill_code}>
                <span>{s.skill_name}</span>
                <strong>+{s.xp_awarded} XP</strong>
              </div>
            ))}
          </section>
        )}
        {result.level_up && (
          <section className="complete-card level-up-card">
            <span className="material-symbols-outlined">auto_awesome</span>
            <div>
              <small>LEVEL UP</small>
              <h2>
                Level {previous} → Level {level}
              </h2>
              {result.unlock_name && <p>{result.unlock_name} unlocked</p>}
            </div>
          </section>
        )}
        {cosmetics.length > 0 && (
          <section className="complete-card">
            <h2>Rewards unlocked</h2>
            {cosmetics.map((c, i) => (
              <div className="complete-row" key={c.code ?? i}>
                <span>
                  {c.name ?? c.code ?? "Cosmetic reward"}
                  {c.slot ? ` · ${c.slot}` : ""}
                </span>
                <strong>Unlocked</strong>
              </div>
            ))}
          </section>
        )}
        <section className="complete-card">
          <div className="complete-progress-head">
            <h2>Your progress</h2>
            <strong>Level {level}</strong>
          </div>
          <div className="challenge-progress-track">
            <div
              className="challenge-progress-fill"
              style={{
                width: `${progressPercent}%`,
              }}
            />
          </div>
          {!isMaxLevel && nextLevelXP !== null && nextLevelXP !== undefined ? (
            <div className="complete-progress-copy">
              <p>
                {total.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
              </p>
              <p>
                {xpToGo.toLocaleString()} XP to go to Level {nextLevel}
              </p>
            </div>
          ) : (
            <p>{total.toLocaleString()} XP · Maximum level reached</p>
          )}
        </section>
        <div className="complete-actions">
          <button className="primary" onClick={onViewProgress}>
            View my progress
          </button>
          <button onClick={onFindAnother}>Find another challenge</button>
        </div>
      </main>
    </div>
  );
}
