import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  createPrototypeActivity,
  previewActivityXp,
  type XPFactorsInput,
} from "../activity-creation/api";
import { factorOptions } from "../activity-creation/model";

type TimeChoice = { label: string; value: number; unit: string };
const timeChoices: TimeChoice[] = [
  { label: "Under 10 minutes", value: 5, unit: "MINUTES" },
  { label: "10–30 minutes", value: 30, unit: "MINUTES" },
  { label: "30–60 minutes", value: 60, unit: "MINUTES" },
  { label: "1–3 hours", value: 3, unit: "HOURS" },
  { label: "Half day", value: 4, unit: "HOURS" },
  { label: "Full day", value: 8, unit: "HOURS" },
  { label: "Multiple days", value: 3, unit: "DAYS" },
  { label: "Multiple weeks", value: 3, unit: "WEEKS" },
];

const categories = [
  "Profile",
  "Learning",
  "Employment",
  "Networking",
  "Community",
  "Innovation",
  "Leadership",
  "Research",
];
const pretty = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export function CreateTaskScreen() {
  const [creatorRole, setCreatorRole] = useState<"EDUCATOR" | "EMPLOYER">(
    "EDUCATOR",
  );
  const [title, setTitle] = useState("Upload Your Resume");
  const [description, setDescription] = useState(
    "Draft your resume using the Alumable template and upload it for feedback.",
  );
  const [category, setCategory] = useState("Profile");
  const [difficulty, setDifficulty] = useState("MODERATE");
  const [timeIndex, setTimeIndex] = useState(1);
  const [skillLevel, setSkillLevel] = useState("BEGINNER");
  const [effort, setEffort] = useState("LOW");
  const [complexity, setComplexity] = useState("SINGLE_STEP");
  const [impact, setImpact] = useState("MODERATE");
  const [verification, setVerification] = useState("EDUCATOR_APPROVAL");
  const [repeatability, setRepeatability] = useState("ONE_TIME");
  const [minimumLevel, setMinimumLevel] = useState(1);
  const [completionType, setCompletionType] = useState("SUBMISSION");
  const [status, setStatus] = useState<"Draft" | "Active" | "Inactive">(
    "Active",
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dev, setDev] = useState(60),
    [cyber, setCyber] = useState(30),
    [comm, setComm] = useState(10);
  const [reward, setReward] = useState("");
  const [saving, setSaving] = useState(false),
    [message, setMessage] = useState("");
  const [previewXp, setPreviewXp] = useState<number | null>(null);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [previewError, setPreviewError] = useState("");
  const selectedTime = timeChoices[timeIndex];
  const allocationTotal = dev + cyber + comm;

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setPreviewLoading(true);
      setPreviewError("");

      const factors: XPFactorsInput = {
        difficulty,
        estimated_time_value: selectedTime.value,
        estimated_time_unit: selectedTime.unit,
        skill_level: skillLevel,
        effort,
        complexity,
        student_impact: impact,
        verification_method: verification,
        repeatability,
        completion_type: completionType,
      };

      try {
        const result = await previewActivityXp(factors);
        if (!controller.signal.aborted) {
          setPreviewXp(result.calculated_xp);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setPreviewXp(null);
          setPreviewError(
            err instanceof Error ? err.message : "Could not calculate XP",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setPreviewLoading(false);
        }
      }
    }, 200);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [
    difficulty,
    timeIndex,
    skillLevel,
    effort,
    complexity,
    impact,
    verification,
    repeatability,
    completionType,
  ]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const activity = await createPrototypeActivity({
        creator_external_id:
          creatorRole === "EDUCATOR" ? "demo-educator-1" : "demo-employer-1",
        creator_role: creatorRole,
        title,
        description,
        category,
        status,
        factors: {
          difficulty,
          estimated_time_value: selectedTime.value,
          estimated_time_unit: selectedTime.unit,
          skill_level: skillLevel,
          effort,
          complexity,
          student_impact: impact,
          verification_method: verification,
          repeatability,
          completion_type: completionType,
        },
        skill_allocations: [
          { skill_code: "SOFTWARE_DEVELOPMENT", percentage: dev },
          { skill_code: "CYBERSECURITY", percentage: cyber },
          { skill_code: "COMMUNICATION", percentage: comm },
        ].filter((item) => item.percentage > 0),
        cosmetic_reward_code: reward || null,
        minimum_level: minimumLevel,
      });
      setPreviewXp(activity.final_xp);
      setMessage(
        `Created and ${status === "Active" ? "published" : "saved"}: ${activity.title}`,
      );
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not create task");
    } finally {
      setSaving(false);
    }
  }

  const select = (
    label: string,
    value: string,
    setter: (v: string) => void,
    options: readonly string[],
  ) => (
    <label>
      {label}
      <select value={value} onChange={(e) => setter(e.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {pretty(option)}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="configure-activity-page">
      <div className="configure-heading">
        <div>
          <h1>Configure Activity</h1>
          <p>Create an activity using the Gamification Rules Guide factors.</p>
        </div>
        <span className={`configure-status ${status.toLowerCase()}`}>
          {status}
        </span>
      </div>
      <div className="configure-layout">
        <form className="configure-form" onSubmit={submit}>
          <div className="configure-grid">
            <label className="full">
              Creator type
              <select
                value={creatorRole}
                onChange={(e) =>
                  setCreatorRole(e.target.value as "EDUCATOR" | "EMPLOYER")
                }
              >
                <option value="EDUCATOR">Educator</option>
                <option value="EMPLOYER">Employer</option>
              </select>
            </label>
            <label className="full">
              Activity title
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
            <label className="full">
              Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </label>
            <label>
              Activity category
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            {select(
              "Difficulty",
              difficulty,
              setDifficulty,
              factorOptions.difficulty,
            )}
            <label>
              Estimated completion time
              <select
                value={timeIndex}
                onChange={(e) => setTimeIndex(Number(e.target.value))}
              >
                {timeChoices.map((x, i) => (
                  <option value={i} key={x.label}>
                    {x.label}
                  </option>
                ))}
              </select>
            </label>
            {select(
              "Skill level required",
              skillLevel,
              setSkillLevel,
              factorOptions.skill_level,
            )}
            {select("Effort required", effort, setEffort, factorOptions.effort)}
            {select(
              "Task complexity",
              complexity,
              setComplexity,
              factorOptions.complexity,
            )}
            {select(
              "Student impact",
              impact,
              setImpact,
              factorOptions.student_impact,
            )}
            {select(
              "Verification method",
              verification,
              setVerification,
              factorOptions.verification_method,
            )}
            {select(
              "Repeatability",
              repeatability,
              setRepeatability,
              factorOptions.repeatability,
            )}
            <label>
              Minimum student level
              <select
                value={minimumLevel}
                onChange={(e) => setMinimumLevel(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6].map((level) => (
                  <option key={level} value={level}>
                    Level {level}
                  </option>
                ))}
              </select>
            </label>
            {select(
              "Completion type",
              completionType,
              setCompletionType,
              factorOptions.completion_type,
            )}
            <label>
              Start date
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label>
              End date
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
          </div>

          <details className="configure-extra">
            <summary>Skill XP allocation & optional reward</summary>
            <div className="allocation-row">
              <span>Software Development</span>
              <input
                type="number"
                min="0"
                max="100"
                value={dev}
                onChange={(e) => setDev(Number(e.target.value))}
              />
              <b>%</b>
            </div>
            <div className="allocation-row">
              <span>Cybersecurity</span>
              <input
                type="number"
                min="0"
                max="100"
                value={cyber}
                onChange={(e) => setCyber(Number(e.target.value))}
              />
              <b>%</b>
            </div>
            <div className="allocation-row">
              <span>Communication</span>
              <input
                type="number"
                min="0"
                max="100"
                value={comm}
                onChange={(e) => setComm(Number(e.target.value))}
              />
              <b>%</b>
            </div>
            <p className="muted">
              Total allocation: {allocationTotal}% (maximum 100%).
            </p>
            <label>
              Optional cosmetic reward
              <select
                value={reward}
                onChange={(e) => setReward(e.target.value)}
              >
                <option value="">No cosmetic reward</option>
                <option value="SECURITY_HOODIE">Security Hoodie</option>
                <option value="CAREER_BLAZER">Career Blazer</option>
                <option value="GOLD_JACKET">Gold Jacket</option>
              </select>
            </label>
          </details>
        </form>

        <aside className="gamification-rail">
          <p className="rail-eyebrow">GAMIFICATION ENGINE</p>
          <div className="rail-card">
            <small>Recommended XP</small>
            <strong>
              {previewLoading ? "…" : previewXp === null ? "—" : previewXp}
              <span> XP</span>
            </strong>
            <p>
              Updates live as XP-related factors change. The preview uses the
              same Python calculation and MySQL rule values used when the
              activity is published.
            </p>
          </div>
          <label>
            Final XP
            <div className="final-xp-box">
              {previewLoading
                ? "Calculating…"
                : previewXp === null
                  ? "Unavailable"
                  : `${previewXp} XP`}
            </div>
            {previewError && (
              <small className="save-message">{previewError}</small>
            )}
          </label>
          <label>
            Status
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "Draft" | "Active" | "Inactive")
              }
            >
              <option>Active</option>
              <option>Draft</option>
              <option>Inactive</option>
            </select>
          </label>
          <div className="rail-selection">
            <small>CURRENT FACTORS</small>
            <span>{pretty(difficulty)}</span>
            <span>{selectedTime.label}</span>
            <span>{pretty(skillLevel)}</span>
            <span>{pretty(effort)}</span>
            <span>{pretty(complexity)}</span>
            <span>{pretty(impact)}</span>
          </div>
          <button
            type="button"
            disabled={saving || allocationTotal > 100}
            onClick={() =>
              document
                .querySelector<HTMLFormElement>(".configure-form")
                ?.requestSubmit()
            }
          >
            {saving
              ? "Publishing…"
              : status === "Active"
                ? "Create & publish"
                : "Save activity"}
          </button>
          {message && <p className="save-message">{message}</p>}
        </aside>
      </div>
    </div>
  );
}
