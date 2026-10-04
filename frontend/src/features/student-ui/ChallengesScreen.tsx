import { useEffect, useMemo, useState } from "react";
import type { PersistedActivity } from "../activity-creation/api";
import {
  completeActivity,
  getStudentActivities,
  type CompletionResult,
  type StudentActivity,
} from "../xp/api";

type Filter = "all" | "in-progress" | "available" | "completed";
type Props = {
  onProgressChanged?: () => void;
  onCompleted?: (activity: PersistedActivity, result: CompletionResult) => void;
};

const pretty = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function ChallengesScreen({
  onProgressChanged,
  onCompleted,
}: Props) {
  const [activities, setActivities] = useState<StudentActivity[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError("");
      setActivities(await getStudentActivities());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load challenges");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const shown = useMemo(
    () =>
      activities.filter((a) => {
        const eligibility = a.student_eligibility;
        const completed = eligibility.completed_count > 0;
        const available = eligibility.can_complete;

        if (filter === "completed") return completed;
        if (filter === "available") return available;
        if (filter === "in-progress") return !completed && available;
        return true;
      }),
    [activities, filter],
  );

  async function finish(a: StudentActivity) {
    if (!a.student_eligibility.can_complete) return;

    try {
      setCompleting(a.external_id);
      setError("");
      const result = await completeActivity(a.external_id);
      onProgressChanged?.();

      // Keep the completion screen's existing activity shape intact.
      onCompleted?.(
        {
          ...a,
          skill_allocations: [],
        } as PersistedActivity,
        result,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not complete challenge");
      await load();
    } finally {
      setCompleting(null);
    }
  }

  return (
    <div className="challenges-screen">
      <section className="challenge-section">
        <h2>Recent challenges</h2>
        <div className="recent-challenges">
          {activities.slice(0, 2).map((a) => {
            const completed = a.student_eligibility.completed_count > 0;
            const locked = a.student_eligibility.reason === "LEVEL_REQUIRED";
            return (
              <div
                className={`recent-challenge-card ${locked ? "locked" : ""}`}
                key={a.external_id}
              >
                <strong>{a.title}</strong>
                <div className="challenge-progress-meta">
                  <span>
                    {locked
                      ? `Level ${a.minimum_level} required`
                      : completed
                        ? "Completed"
                        : "Ready to start"}
                  </span>
                  <span>{a.final_xp} XP</span>
                </div>
                <div className="challenge-progress-track">
                  <div
                    className="challenge-progress-fill"
                    style={{ width: completed ? "100%" : "0%" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="challenge-section all-challenges">
        <h2>All challenges</h2>
        <div className="challenge-filters">
          {(["all", "in-progress", "available", "completed"] as Filter[]).map(
            (f) => (
              <button
                key={f}
                className={filter === f ? "active" : ""}
                onClick={() => setFilter(f)}
              >
                {f === "in-progress"
                  ? "In progress"
                  : f[0].toUpperCase() + f.slice(1)}
              </button>
            ),
          )}
        </div>

        {error && <div className="student-error">{error}</div>}

        <div className="challenge-list">
          {loading && <p>Loading challenges...</p>}
          {!loading && shown.length === 0 && (
            <div className="challenge-empty">No challenges found.</div>
          )}

          {shown.map((a) => {
            const eligibility = a.student_eligibility;
            const locked = eligibility.reason === "LEVEL_REQUIRED";
            const completedOnce = eligibility.completed_count > 0;
            const unavailable = !eligibility.can_complete;
            const oneTimeDone =
              eligibility.reason === "ALREADY_COMPLETED";
            const periodDone =
              eligibility.reason === "COMPLETED_THIS_PERIOD";

            return (
              <article
                className={`challenge-card ${locked ? "locked" : ""} ${
                  oneTimeDone || periodDone ? "completed-card" : ""
                }`}
                key={a.external_id}
              >
                <div className="challenge-card-content">
                  <div className="challenge-card-labels">
                    {locked && (
                      <span className="challenge-lock-label">
                        <span className="material-symbols-outlined">lock</span>
                        Level {a.minimum_level} required
                      </span>
                    )}
                    {!locked && completedOnce && (
                      <span className="challenge-completed-label">
                        <span className="material-symbols-outlined">check_circle</span>
                        Completed
                      </span>
                    )}
                  </div>

                  <strong>{a.title}</strong>
                  <span>
                    {a.final_xp} XP · {a.category} · {pretty(a.repeatability)}
                  </span>
                  {a.description && <p>{a.description}</p>}
                  {!locked && periodDone && eligibility.available_again_label && (
                    <p className="challenge-availability">
                      {eligibility.available_again_label}
                    </p>
                  )}
                </div>

                <button
                  className={`challenge-action ${unavailable ? "completed" : ""}`}
                  disabled={unavailable || completing === a.external_id}
                  onClick={() => finish(a)}
                >
                  {locked
                    ? "Locked"
                    : oneTimeDone
                      ? "Completed"
                      : periodDone
                        ? "Completed"
                        : completing === a.external_id
                          ? "Completing..."
                          : completedOnce
                            ? "Do again"
                            : "Start"}
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
