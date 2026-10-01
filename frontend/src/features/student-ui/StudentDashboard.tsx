import { useEffect, useState } from "react";
import { getStudentProgress, type StudentProgress } from "../xp/api";
type StudentDashboardProps = {
  refreshKey?: number;
  onViewChallenges?: () => void;
};

export function StudentDashboard({
  refreshKey = 0,
  onViewChallenges,
}: StudentDashboardProps) {
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");

    getStudentProgress()
      .then(setProgress)
      .catch((e) =>
        setError(
          e instanceof Error ? e.message : "Could not load student progress",
        ),
      );
  }, [refreshKey]);

  if (error) {
    return (
      <div className="student-home">
        <div className="student-error">{error}</div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="student-home">
        <div className="student-loading">Loading progress...</div>
      </div>
    );
  }

  const level = progress.current_level ?? 1;
  const progressPercent = progress.level_progress_percent ?? 0;

  return (
    <div className="student-home">
      {/* Purple Figma header */}
      <section className="student-home-hero">
        <div className="student-home-decoration student-home-decoration-one" />
        <div className="student-home-decoration student-home-decoration-two" />

        <div className="student-home-brand-row">
          <div className="student-home-brand">alumable</div>

          <button
            className="student-notification-button"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>

            <span className="student-notification-dot" />
          </button>
        </div>

        <h1 className="student-home-greeting">Good morning, Jack</h1>

        {/* LIVE XP CARD */}
        <div className="student-level-card">
          <div className="student-level-card-top">
            <div className="student-level-badge">{level}</div>

            <div className="student-level-info">
              <strong>Level {level}</strong>

              <span>
                {progress.current_level_unlock_name ??
                  "Keep building your experience"}
              </span>
            </div>

            <div className="student-xp-summary">
              <strong>{progress.total_xp.toLocaleString()} XP</strong>

              {!progress.is_max_level && (
                <span>
                  {(progress.xp_to_next_level ?? 0).toLocaleString()} to go
                </span>
              )}
            </div>
          </div>

          <div className="student-xp-progress-track">
            <div
              className="student-xp-progress-fill"
              style={{
                width: `${progressPercent}%`,
              }}
            />
          </div>

          <div className="student-xp-thresholds">
            <span>{(progress.current_level_xp ?? 0).toLocaleString()} XP</span>

            {!progress.is_max_level ? (
              <>
                <strong>Level {progress.next_level}</strong>

                <span>{progress.next_level_xp?.toLocaleString()} XP</span>
              </>
            ) : (
              <strong>Max Level</strong>
            )}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="student-home-content">
        <div className="student-section-heading">
          <h2>Earn XP today</h2>

          <button type="button" onClick={onViewChallenges}>
            See all
          </button>
        </div>

        <div className="student-xp-opportunities">
          <div className="student-xp-opportunity">
            <span className="student-task-dot green" />

            <div>
              <strong>Daily Login</strong>
              <p>Very easy · under 10 min · repeats daily</p>
            </div>

            <strong className="student-task-xp">+5</strong>
          </div>

          <div className="student-xp-opportunity">
            <span className="student-task-dot orange" />

            <div>
              <strong>Upload your resume</strong>
              <p>Moderate · 10–30 min · two-step</p>
            </div>

            <strong className="student-task-xp">+45</strong>
          </div>

          <div className="student-xp-opportunity">
            <span className="student-task-dot red" />

            <div>
              <strong>Complete employer assessment</strong>

              <p>Difficult · 1–3 hrs · employer approval</p>
            </div>

            <strong className="student-task-xp">+250</strong>
          </div>
        </div>

        <div className="student-earnings-card">
          <span>Earned this month</span>

          <strong>$0.00</strong>

          <p>Land your first gig and your earnings show here.</p>
        </div>
      </section>
    </div>
  );
}
