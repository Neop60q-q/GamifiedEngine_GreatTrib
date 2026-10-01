import { useEffect, useState } from "react";
import { getStudentProgress, type StudentProgress } from "../xp/api";

type Props = {
  progressVersion?: number;
};

export default function ProgressScreen({ progressVersion = 0 }: Props) {
  const [progress, setProgress] = useState<StudentProgress | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProgress() {
      try {
        setLoading(true);
        setError("");

        const data = await getStudentProgress();

        setProgress(data);
      } catch (error) {
        console.error("Progress load error:", error);

        setError(
          error instanceof Error ? error.message : "Could not load progress",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, [progressVersion]);

  if (loading) {
    return <div className="learn-loading">Loading progress...</div>;
  }

  if (error || !progress) {
    return (
      <div className="learn-loading">{error || "Could not load progress"}</div>
    );
  }

  const percentage = progress.level_progress_percent ?? 0;

  const circumference = 2 * Math.PI * 74;

  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="progress-screen">
      <section className="xp-overview-card">
        <div className="xp-ring">
          <svg
            className="xp-ring-svg"
            width="168"
            height="168"
            viewBox="0 0 168 168"
          >
            <circle className="xp-ring-background" cx="84" cy="84" r="74" />

            <circle
              className="xp-ring-progress"
              cx="84"
              cy="84"
              r="74"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>

          <div className="xp-ring-content">
            <span className="xp-level">LEVEL {progress.current_level}</span>

            <strong className="xp-total">
              {progress.total_xp.toLocaleString()}
            </strong>

            {!progress.is_max_level ? (
              <>
                <span className="xp-target">
                  of {progress.next_level_xp?.toLocaleString()} XP
                </span>

                <span className="xp-next-level">
                  {Math.round(progress.level_progress_percent)}% to Level{" "}
                  {progress.next_level}
                </span>
              </>
            ) : (
              <span className="xp-next-level">Maximum level reached</span>
            )}
          </div>
        </div>
      </section>

      <section className="progress-stats">
        <div className="progress-stat">
          <strong>0</strong>
          <span>Day streak</span>
        </div>

        <div className="progress-stat">
          <strong>0</strong>
          <span>Badges earned</span>
        </div>

        <div className="progress-stat">
          <strong>0</strong>
          <span>Challenges live</span>
        </div>
      </section>

      <section className="recent-xp-section">
        <h2>Recent XP</h2>

        <div className="recent-xp-card">
          <div className="recent-xp-empty">
            <span className="material-symbols-outlined">history</span>

            <div>
              <strong>Your XP activity will appear here</strong>
              <p>Complete activities and challenges to earn XP.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
