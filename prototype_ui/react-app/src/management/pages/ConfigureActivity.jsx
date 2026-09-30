import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useManagement } from "../context/ManagementContext";

const ACTIVITY_ID = "resume";

export default function ConfigureActivity() {
  const navigate = useNavigate();

  const {
    getItem,
    updateItem,
    saveDraft,
    setCurrentItemId,
  } = useManagement();

  const activity = getItem(ACTIVITY_ID);

  const [form, setForm] = useState({
    title: activity?.title ?? "Upload Your Resume",
    description:
      activity?.description ??
      "Draft your resume using the Alumable template and upload it for feedback.",

    category: activity?.category ?? "Career Readiness",
    difficulty: activity?.difficulty ?? "Moderate",

    timeValue: activity?.timeValue ?? 30,
    timeUnit: activity?.timeUnit ?? "Minutes",

    skillLevel: activity?.skillLevel ?? "Beginner",
    effort: activity?.effort ?? "Low",
    complexity: activity?.complexity ?? "Single Step",
    impact: activity?.impact ?? "Moderate",

    verification:
      activity?.verification ?? "Educator Approval",

    repeatability:
      activity?.repeatability ?? "One Time",

    completionType:
      activity?.completionType ?? "Submission",

    startDate: activity?.startDate ?? "2026-09-01",
    endDate: activity?.endDate ?? "2026-09-30",

    finalXp: activity?.finalXp ?? 45,
  });

  /*
   * The guide describes the XP factors, but does not provide
   * a complete numeric formula for every factor.
   *
   * Keep the template recommendation at 45 XP for this POC.
   */
  const recommendedXp = activity?.recommendedXp ?? 45;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const buildUpdates = () => ({
    ...form,
    timeValue: Number(form.timeValue),
    finalXp: Number(form.finalXp),
    recommendedXp,
  });

  const handleSave = () => {
    saveDraft(ACTIVITY_ID, buildUpdates());

    setCurrentItemId(null);

    navigate("/management/library");
  };

  const handleContinue = () => {
    updateItem(ACTIVITY_ID, {
      ...buildUpdates(),
      status: "Draft",
    });

    setCurrentItemId(ACTIVITY_ID);

    navigate("/management/assign");
  };

  return (
    <main className="configure-page">
      {/* =========================
          LEFT SIDE
          ========================= */}

      <section className="configure-main">
        <header className="configure-header">
          <div>
            <h1>Configure Activity</h1>

            <p>
              From template: Upload Resume Draft
            </p>
          </div>

          <span className="draft-badge">
            Draft
          </span>
        </header>

        <div className="configure-form">
          {/* TYPE */}

          <div className="config-field config-full">
            <label>Type</label>

            <div className="type-selector">
              <button
                type="button"
                className="type-option active"
              >
                Activity
              </button>

              <button
                type="button"
                className="type-option"
                onClick={() =>
                  navigate(
                    "/management/challenges/create"
                  )
                }
              >
                Challenge
              </button>
            </div>
          </div>

          {/* TITLE */}

          <div className="config-field config-full">
            <label htmlFor="activity-title">
              Activity title
            </label>

            <input
              id="activity-title"
              name="title"
              type="text"
              className="config-input"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          {/* DESCRIPTION */}

          <div className="config-field config-full">
            <label htmlFor="activity-description">
              Description
            </label>

            <textarea
              id="activity-description"
              name="description"
              className="config-textarea"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* CATEGORY */}

          <SelectField
            label="Activity category"
            name="category"
            value={form.category}
            onChange={handleChange}
            options={[
              "Career Readiness",
              "Profile",
              "Learning",
              "Employment",
              "Networking",
              "Community",
              "Innovation",
              "Leadership",
              "Research",
            ]}
          />

          {/* DIFFICULTY */}

          <SelectField
            label="Difficulty"
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            options={[
              "Very Easy",
              "Easy",
              "Moderate",
              "Difficult",
              "Expert",
            ]}
          />

          {/* TIME */}

          <div className="config-field">
            <label>
              Estimated completion time
            </label>

            <div className="time-field">
              <input
                name="timeValue"
                type="number"
                min="1"
                className="config-input"
                value={form.timeValue}
                onChange={handleChange}
              />

              <select
                name="timeUnit"
                className="config-select time-unit"
                value={form.timeUnit}
                onChange={handleChange}
              >
                <option>Minutes</option>
                <option>Hours</option>
                <option>Days</option>
                <option>Weeks</option>
              </select>
            </div>
          </div>

          {/* SKILL LEVEL */}

          <SelectField
            label="Skill level required"
            name="skillLevel"
            value={form.skillLevel}
            onChange={handleChange}
            options={[
              "None",
              "Beginner",
              "Intermediate",
              "Advanced",
              "Professional",
            ]}
          />

          {/* EFFORT */}

          <SelectField
            label="Effort required"
            name="effort"
            value={form.effort}
            onChange={handleChange}
            options={[
              "Minimal",
              "Low",
              "Moderate",
              "High",
              "Intensive",
            ]}
          />

          {/* COMPLEXITY */}

          <SelectField
            label="Task complexity"
            name="complexity"
            value={form.complexity}
            onChange={handleChange}
            options={[
              "Single Step",
              "Two-Step",
              "Multiple Steps",
              "Multi-stage",
              "Ongoing",
            ]}
          />

          {/* IMPACT */}

          <SelectField
            label="Student impact"
            name="impact"
            value={form.impact}
            onChange={handleChange}
            options={[
              "Low",
              "Moderate",
              "High",
              "Significant",
              "Transformational",
            ]}
          />

          {/* VERIFICATION */}

          <SelectField
            label="Verification method"
            name="verification"
            value={form.verification}
            onChange={handleChange}
            options={[
              "Automatic",
              "Self-Declaration",
              "Educator Approval",
              "Employer Approval",
              "Manual Review",
            ]}
          />

          {/* REPEATABILITY */}

          <SelectField
            label="Repeatability"
            name="repeatability"
            value={form.repeatability}
            onChange={handleChange}
            options={[
              "One Time",
              "Daily",
              "Weekly",
              "Monthly",
              "Unlimited",
            ]}
          />

          {/* COMPLETION TYPE */}

          <SelectField
            label="Completion type"
            name="completionType"
            value={form.completionType}
            onChange={handleChange}
            options={[
              "Completion",
              "Pass/Fail",
              "Score Based",
              "Attendance",
              "Submission",
              "Employer Accepted",
            ]}
          />

          {/* DATES */}

          <div className="config-field">
            <label htmlFor="start-date">
              Start date
            </label>

            <input
              id="start-date"
              name="startDate"
              type="date"
              className="config-input"
              value={form.startDate}
              onChange={handleChange}
            />
          </div>

          <div className="config-field">
            <label htmlFor="end-date">
              End date
            </label>

            <input
              id="end-date"
              name="endDate"
              type="date"
              className="config-input"
              value={form.endDate}
              onChange={handleChange}
            />
          </div>
        </div>
      </section>

      {/* =========================
          RIGHT GAMIFICATION PANEL
          ========================= */}

      <aside className="gamification-panel">
        <span className="engine-label">
          GAMIFICATION ENGINE
        </span>

        <div className="xp-card">
          <span className="xp-card-label">
            Recommended XP
          </span>

          <div className="xp-value">
            {recommendedXp}
            <span> XP</span>
          </div>

          <p>
            Calculated from difficulty, time,
            effort, complexity, impact and
            verification method.
          </p>
        </div>

        <div className="engine-field">
          <label htmlFor="final-xp">
            Final XP
          </label>

          <input
            id="final-xp"
            name="finalXp"
            type="number"
            min="0"
            className="engine-input"
            value={form.finalXp}
            onChange={handleChange}
          />

          <p>
            Accept or adjust within allowed
            limits before publishing.
          </p>
        </div>

        <div className="engine-field">
          <label>Status</label>

          <div className="engine-input">
            Draft
          </div>

          <p>
            Status changes to Active after
            students are assigned and the
            activity is published.
          </p>
        </div>

        <div className="engine-actions">
          <button
            type="button"
            className="secondary-action"
            onClick={handleSave}
          >
            Save
          </button>

          <button
            type="button"
            className="primary-action"
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </aside>
    </main>
  );
}

function SelectField({
  label,
  name,
  value,
  options,
  onChange,
}) {
  return (
    <div className="config-field">
      <label htmlFor={name}>
        {label}
      </label>

      <select
        id={name}
        name={name}
        className="config-select"
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}