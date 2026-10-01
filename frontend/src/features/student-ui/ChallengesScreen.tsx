import { useEffect, useMemo, useState } from "react";
import {
  listActiveActivities,
  type PersistedActivity,
} from "../activity-creation/api";
import { completeActivity, type CompletionResult } from "../xp/api";
type Filter = "all" | "in-progress" | "available" | "completed";
type Props = {
  onProgressChanged?: () => void;
  onCompleted?: (activity: PersistedActivity, result: CompletionResult) => void;
};
export default function ChallengesScreen({
  onProgressChanged,
  onCompleted,
}: Props) {
  const [activities, setActivities] = useState<PersistedActivity[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  async function load() {
    try {
      setLoading(true);
      setError("");
      setActivities(await listActiveActivities());
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
      activities.filter(
        (a) =>
          filter === "all" ||
          (filter === "completed"
            ? completedIds.has(a.external_id)
            : filter === "available"
              ? !completedIds.has(a.external_id)
              : filter === "in-progress"
                ? !completedIds.has(a.external_id)
                : true),
      ),
    [activities, completedIds, filter],
  );
  async function finish(a: PersistedActivity) {
    try {
      setCompleting(a.external_id);
      setError("");
      const result = await completeActivity(a.external_id);
      setCompletedIds((prev) => new Set(prev).add(a.external_id));
      onProgressChanged?.();
      onCompleted?.(a, result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not complete challenge");
    } finally {
      setCompleting(null);
    }
  }
  return (
    <div className="challenges-screen">
      <section className="challenge-section">
        <h2>Recent challenges</h2>
        <div className="recent-challenges">
          {activities.slice(0, 2).map((a) => (
            <div className="recent-challenge-card" key={a.external_id}>
              <strong>{a.title}</strong>
              <div className="challenge-progress-meta">
                <span>
                  {completedIds.has(a.external_id)
                    ? "Completed"
                    : "Ready to start"}
                </span>
                <span>{a.final_xp} XP</span>
              </div>
              <div className="challenge-progress-track">
                <div
                  className="challenge-progress-fill"
                  style={{
                    width: completedIds.has(a.external_id) ? "100%" : "0%",
                  }}
                />
              </div>
            </div>
          ))}
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
            const done = completedIds.has(a.external_id);
            return (
              <article className="challenge-card" key={a.external_id}>
                <div className="challenge-card-content">
                  <strong>{a.title}</strong>
                  <span>
                    {a.final_xp} XP · {a.category}
                  </span>
                  {a.description && <p>{a.description}</p>}
                </div>
                <button
                  className={`challenge-action ${done ? "completed" : ""}`}
                  disabled={done || completing === a.external_id}
                  onClick={() => finish(a)}
                >
                  {done
                    ? "Completed"
                    : completing === a.external_id
                      ? "Completing..."
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
