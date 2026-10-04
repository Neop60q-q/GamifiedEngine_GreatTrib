import { useEffect, useState } from "react";
import { getStudentProgress, type StudentProgress } from "../xp/api";
type Tab = "achievements" | "skills" | "portfolio";
const badges = [
  { icon: "flag", name: "First Steps", state: "Earned", earned: true },
  { icon: "star", name: "Rising Star", state: "Earned", earned: true },
  {
    icon: "workspace_premium",
    name: "Job Ready",
    state: "Earned",
    earned: true,
  },
  { icon: "groups", name: "Team Player", state: "Earned", earned: true },
  {
    icon: "business_center",
    name: "Career Builder",
    state: "Finish an internship",
    earned: false,
  },
  { icon: "lock", name: "Hidden", state: "Keep going", earned: false },
];
export function ProfileScreen({
  progressVersion = 0,
}: {
  progressVersion?: number;
}) {
  const [tab, setTab] = useState<Tab>("achievements");
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  useEffect(() => {
    getStudentProgress()
      .then(setProgress)
      .catch(() => setProgress(null));
  }, [progressVersion]);
  return (
    <div className="profile-figma-v2">
      <header className="profile-v2-hero">
        <div className="profile-v2-decoration" />
        <div className="profile-v2-title">
          <h1>Profile</h1>
        </div>
        <div className="profile-v2-user-card">
          <div className="profile-v2-avatar">J</div>
          <div className="profile-v2-user-copy">
            <h2>Jack Brown</h2>
            <p>jackbrown@gmail.com</p>
            {progress && (
              <span>
                Level {progress.current_level} ·{" "}
                {progress.total_xp.toLocaleString()} XP
              </span>
            )}
          </div>
          <button>
            <span className="material-symbols-outlined">edit</span>Edit
          </button>
        </div>
        <div className="profile-v2-tabs">
          {(["achievements", "skills", "portfolio"] as Tab[]).map((t) => (
            <button
              key={t}
              className={tab === t ? "active" : ""}
              onClick={() => setTab(t)}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </header>
      <main className="profile-v2-content">
        {tab === "achievements" && (
          <div className="badge-grid">
            {badges.map((b) => (
              <article key={b.name} className={b.earned ? "earned" : "locked"}>
                <div className="badge-icon">
                  <span className="material-symbols-outlined">{b.icon}</span>
                </div>
                <strong>{b.name}</strong>
                <span>{b.state}</span>
              </article>
            ))}
          </div>
        )}
        {tab === "skills" && (
          <section className="profile-list-card">
            <div className="profile-section-intro">
              <h2>Skills</h2>
              <p>XP earned across your skill areas.</p>
            </div>
            {progress?.skills?.length ? (
              progress.skills.map((s) => {
                const pct = Math.min(100, (s.total_xp / 500) * 100);
                return (
                  <div className="skill-detail" key={s.skill_code}>
                    <div>
                      <strong>{s.skill_name}</strong>
                      <span>{s.total_xp.toLocaleString()} XP</span>
                    </div>
                    <div className="skill-track">
                      <span style={{ width: `${pct}%` }} />
                    </div>
                    <small>Skill XP</small>
                  </div>
                );
              })
            ) : (
              <div className="profile-empty">
                <span className="material-symbols-outlined">psychology</span>
                <strong>No skill XP yet</strong>
                <p>Complete a challenge to start developing skills.</p>
              </div>
            )}
          </section>
        )}
        {tab === "portfolio" && (
          <section className="profile-list-card">
            <div className="profile-section-intro">
              <h2>Portfolio</h2>
              <p>Your projects and evidence in one place.</p>
            </div>
            <div className="portfolio-placeholder">
              <span className="material-symbols-outlined">folder_special</span>
              <div>
                <strong>Build your portfolio</strong>
                <p>
                  Completed projects and evidence can be shown here as Alumable
                  integration expands.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
