import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useManagement } from "../context/ManagementContext";

const CHALLENGE_ID = "portfolio-sprint";

const verificationOptions = [
  "Automatic",
  "Self-Declaration",
  "Educator Approval",
  "Employer Approval",
  "Manual Review",
  "Peer verified",
];

const rewardOptions = [
  ["xp", "XP"],
  ["badge", "Badge"],
  ["trophy", "Trophy"],
  ["unlock", "Unlock"],
  ["certificate", "Certificate"],
  ["bonusXp", "Bonus XP"],
  ["employerRecommendation", "Employer Recommendation"],
  ["leaderboardPosition", "Leaderboard Position"],
];

export default function ConfigureChallenge() {
  const navigate = useNavigate();

  const {
    getItem,
    updateItem,
    saveDraft,
    setCurrentItemId,
  } = useManagement();

  const challenge = getItem(CHALLENGE_ID);

  /* =========================
     MAIN FORM
     ========================= */

  const [form, setForm] = useState({
    title:
      challenge?.title ??
      "Portfolio Sprint with Northline Studio",

    description:
      challenge?.description ??
      "Five activities culminating in employer portfolio review.",

    difficulty:
      challenge?.difficulty ?? "Hard",

    expectedTime:
      challenge?.expectedTime ?? "One Week",

    goal:
      challenge?.goal ??
      "Complete five activities",

    challengeType:
      challenge?.challengeType ?? "Learning",

    employerSponsored:
      challenge?.employerSponsored ??
      "Yes — Northline Studio",

    creatorType:
      challenge?.creatorType ?? "Educator",

    creatorId:
      challenge?.creatorId ??
      "educator-demo-001",

    /* Editable Final XP */
    finalXp:
      challenge?.finalXp ?? 275,
  });

  /* =========================
     SKILLS
     ========================= */

  const [skills, setSkills] = useState(
    challenge?.skills ?? [
      "Portfolio",
      "Communication",
      "Industry Experience",
    ]
  );

  const [newSkill, setNewSkill] = useState("");

  /* =========================
     ACTIVITIES
     ========================= */

  const [activities, setActivities] = useState(
    challenge?.activities ?? [
      {
        id: 1,
        title: "Brief call with Northline",
        verification: "Employer Approval",
        xp: 30,
      },
      {
        id: 2,
        title: "Upload three work samples",
        verification: "Employer Approval",
        xp: 60,
      },
      {
        id: 3,
        title: "Write a 300-word case study",
        verification: "Educator Approval",
        xp: 45,
      },
      {
        id: 4,
        title: "Peer review two portfolios",
        verification: "Peer verified",
        xp: 20,
      },
      {
        id: 5,
        title: "Submit for employer review",
        verification: "Employer Approval",
        xp: 120,
      },
    ]
  );

  /* =========================
     REWARDS
     ========================= */

  const [rewards, setRewards] = useState(
    challenge?.rewards ?? {
      xp: true,
      badge: true,
      trophy: false,
      unlock: false,
      certificate: true,
      bonusXp: false,
      employerRecommendation: false,
      leaderboardPosition: false,
    }
  );

  const [editingActivityId, setEditingActivityId] =
    useState(null);

  /* =========================
     XP CALCULATION
     ========================= */

  const totalXp = activities.reduce(
    (total, activity) =>
      total + Number(activity.xp || 0),
    0
  );

  /* =========================
     FORM HANDLERS
     ========================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /* =========================
     ACTIVITY HANDLERS
     ========================= */

  const updateActivity = (
    id,
    field,
    value
  ) => {
    setActivities((current) =>
      current.map((activity) =>
        activity.id === id
          ? {
              ...activity,
              [field]:
                field === "xp"
                  ? Number(value)
                  : value,
            }
          : activity
      )
    );
  };

  const addActivity = () => {
    const newId =
      activities.length === 0
        ? 1
        : Math.max(
            ...activities.map(
              (activity) => activity.id
            )
          ) + 1;

    const newActivity = {
      id: newId,
      title: "New activity",
      verification: "Educator Approval",
      xp: 0,
    };

    setActivities((current) => [
      ...current,
      newActivity,
    ]);

    setEditingActivityId(newId);
  };

  const removeActivity = (id) => {
    setActivities((current) =>
      current.filter(
        (activity) => activity.id !== id
      )
    );

    if (editingActivityId === id) {
      setEditingActivityId(null);
    }
  };

  /* =========================
     SKILL HANDLERS
     ========================= */

  const addSkill = () => {
    const value = newSkill.trim();

    if (!value) {
      return;
    }

    const alreadyExists = skills.some(
      (skill) =>
        skill.toLowerCase() ===
        value.toLowerCase()
    );

    if (!alreadyExists) {
      setSkills((current) => [
        ...current,
        value,
      ]);
    }

    setNewSkill("");
  };

  const removeSkill = (skillToRemove) => {
    setSkills((current) =>
      current.filter(
        (skill) =>
          skill !== skillToRemove
      )
    );
  };

  /* =========================
     REWARD HANDLER
     ========================= */

  const toggleReward = (key) => {
    setRewards((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  /* =========================
     BUILD SAVED DATA
     ========================= */

  const buildUpdates = () => ({
    ...form,

    skills,
    activities,
    rewards,

    /*
     * Challenge total XP is automatically
     * calculated from its activities.
     */
    recommendedXp: totalXp,

    /*
     * Final XP is independently editable.
     */
    finalXp: Number(form.finalXp),
  });

  /* =========================
     SAVE
     ========================= */

  const handleSave = () => {
    saveDraft(
      CHALLENGE_ID,
      buildUpdates()
    );

    setCurrentItemId(null);

    navigate("/management/library");
  };

  /* =========================
     CONTINUE
     ========================= */

  const handleContinue = () => {
    updateItem(CHALLENGE_ID, {
      ...buildUpdates(),
      status: "Draft",
    });

    setCurrentItemId(CHALLENGE_ID);

    navigate("/management/assign");
  };

  return (
    <main className="configure-page">
      {/* =================================
          LEFT SIDE
          ================================= */}

      <section className="configure-main">
        <header className="configure-header">
          <div>
            <h1>
              Configure Challenge
            </h1>

            <p>
              From template: Portfolio Sprint
              with Northline Studio
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
                className="type-option"
                onClick={() =>
                  navigate(
                    "/management/activities/create"
                  )
                }
              >
                Activity
              </button>

              <button
                type="button"
                className="type-option active"
              >
                Challenge
              </button>
            </div>
          </div>

          {/* TITLE */}

          <div className="config-field config-full">
            <label htmlFor="challenge-title">
              Challenge title
            </label>

            <input
              id="challenge-title"
              name="title"
              type="text"
              className="config-input"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          {/* DESCRIPTION */}

          <div className="config-field config-full">
            <label htmlFor="challenge-description">
              Description
            </label>

            <textarea
              id="challenge-description"
              name="description"
              className="config-textarea"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* DIFFICULTY */}

          <SelectField
            label="Challenge difficulty"
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            options={[
              "Easy",
              "Medium",
              "Hard",
              "Expert",
            ]}
          />

          {/* EXPECTED TIME */}

          <SelectField
            label="Expected completion time"
            name="expectedTime"
            value={form.expectedTime}
            onChange={handleChange}
            options={[
              "One Day",
              "One Week",
              "One Month",
              "Semester",
              "Placement",
              "Internship",
            ]}
          />

          {/* GOAL */}

          <div className="config-field">
            <label htmlFor="challenge-goal">
              Challenge goal
            </label>

            <input
              id="challenge-goal"
              name="goal"
              type="text"
              className="config-input"
              value={form.goal}
              onChange={handleChange}
            />
          </div>

          {/* CHALLENGE TYPE */}

          <SelectField
            label="Challenge type"
            name="challengeType"
            value={form.challengeType}
            onChange={handleChange}
            options={[
              "Progression",
              "Learning",
              "Employment",
              "Event",
              "Community",
              "Employer Sponsored",
              "Seasonal",
            ]}
          />

          {/* EMPLOYER SPONSORED */}

          <div className="config-field config-full">
            <label htmlFor="employer-sponsored">
              Employer sponsored
            </label>

            <input
              id="employer-sponsored"
              name="employerSponsored"
              type="text"
              className="config-input"
              value={form.employerSponsored}
              onChange={handleChange}
            />
          </div>

          {/* SKILLS */}

          <div className="config-field config-full">
            <label>
              Skills developed
            </label>

            <div className="skill-list">
              {skills.map(
                (skill, index) => (
                  <button
                    type="button"
                    key={skill}
                    className={
                      index % 3 === 0
                        ? "skill-chip skill-purple"
                        : index % 3 === 1
                        ? "skill-chip skill-blue"
                        : "skill-chip skill-green"
                    }
                    onClick={() =>
                      removeSkill(skill)
                    }
                    title="Click to remove"
                  >
                    {skill}
                  </button>
                )
              )}

              <div className="challenge-add-skill">
                <input
                  type="text"
                  value={newSkill}
                  placeholder="Add skill"
                  onChange={(event) =>
                    setNewSkill(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter"
                    ) {
                      event.preventDefault();
                      addSkill();
                    }
                  }}
                />

                <button
                  type="button"
                  className="add-skill"
                  onClick={addSkill}
                >
                  <span className="material-symbols-outlined">
                    add
                  </span>

                  Add skill
                </button>
              </div>
            </div>
          </div>

          {/* =================================
              ACTIVITIES
              ================================= */}

          <div className="config-field config-full">
            <div className="challenge-activities">
              <h2>
                Activities in this challenge
              </h2>

              <p className="challenge-activities-intro">
                Five activities, completed in
                order. Students see these as
                their task list.
              </p>

              {activities.map(
                (activity, index) => {
                  const isEditing =
                    editingActivityId ===
                    activity.id;

                  return (
                    <div
                      className="challenge-activity-row"
                      key={activity.id}
                    >
                      <span className="activity-number">
                        {index + 1}
                      </span>

                      {isEditing ? (
                        <>
                          {/* EDIT TITLE */}

                          <input
                            type="text"
                            className="challenge-row-input activity-name"
                            value={activity.title}
                            onChange={(event) =>
                              updateActivity(
                                activity.id,
                                "title",
                                event.target.value
                              )
                            }
                          />

                          {/* EDIT VERIFICATION */}

                          <select
                            className="challenge-row-select"
                            value={
                              activity.verification
                            }
                            onChange={(event) =>
                              updateActivity(
                                activity.id,
                                "verification",
                                event.target.value
                              )
                            }
                          >
                            {verificationOptions.map(
                              (option) => (
                                <option
                                  key={option}
                                  value={option}
                                >
                                  {option}
                                </option>
                              )
                            )}
                          </select>

                          {/* EDIT XP */}

                          <input
                            type="number"
                            min="0"
                            className="challenge-row-xp"
                            value={activity.xp}
                            onChange={(event) =>
                              updateActivity(
                                activity.id,
                                "xp",
                                event.target.value
                              )
                            }
                          />

                          {/* DONE */}

                          <button
                            type="button"
                            className="challenge-row-action"
                            onClick={() =>
                              setEditingActivityId(
                                null
                              )
                            }
                          >
                            Done
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            className="challenge-row-delete"
                            onClick={() =>
                              removeActivity(
                                activity.id
                              )
                            }
                            aria-label="Remove activity"
                          >
                            <span className="material-symbols-outlined">
                              delete
                            </span>
                          </button>
                        </>
                      ) : (
                        <>
                          <strong className="activity-name">
                            {activity.title}
                          </strong>

                          <span className="activity-verification">
                            {
                              activity.verification
                            }
                          </span>

                          <span className="activity-xp">
                            +{activity.xp}
                          </span>

                          <button
                            type="button"
                            className="challenge-row-action"
                            onClick={() =>
                              setEditingActivityId(
                                activity.id
                              )
                            }
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                  );
                }
              )}

              {/* ADD ACTIVITY */}

              <button
                type="button"
                className="add-activity-button"
                onClick={addActivity}
              >
                <span className="material-symbols-outlined">
                  add
                </span>

                Add activity
              </button>

              {/* SUMMARY */}

              <div className="challenge-summary">
                <div>
                  <span>
                    Selected activities
                  </span>

                  <strong>
                    {activities.length}
                  </strong>
                </div>

                <div className="challenge-total">
                  <span>
                    Activities total XP
                  </span>

                  <strong>
                    {totalXp} XP
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* =================================
              REWARDS
              ================================= */}

          <div className="config-field config-full">
            <label>
              Challenge reward types
            </label>

            <div className="reward-grid">
              {rewardOptions.map(
                ([key, label]) => (
                  <button
                    type="button"
                    key={key}
                    className={`reward-option ${
                      rewards[key]
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      toggleReward(key)
                    }
                  >
                    <span className="material-symbols-outlined">
                      {rewards[key]
                        ? "check_box"
                        : "check_box_outline_blank"}
                    </span>

                    {label}
                  </button>
                )
              )}
            </div>
          </div>

          {/* CREATOR TYPE */}

          <div className="config-field">
            <label htmlFor="creator-type">
              Creator type
            </label>

            <select
              id="creator-type"
              name="creatorType"
              className="config-select"
              value={form.creatorType}
              onChange={handleChange}
            >
              <option value="Educator">
                Educator
              </option>

              <option value="Employer">
                Employer
              </option>
            </select>
          </div>

          {/* CREATOR ID */}

          <div className="config-field">
            <label htmlFor="creator-id">
              Creator ID
            </label>

            <input
              id="creator-id"
              name="creatorId"
              type="text"
              className="config-input"
              value={form.creatorId}
              onChange={handleChange}
            />
          </div>
        </div>
      </section>

      {/* =================================
          RIGHT GAMIFICATION PANEL
          ================================= */}

      <aside className="gamification-panel">
        <div>
          <span className="engine-label">
            GAMIFICATION ENGINE
          </span>

          {/* CHALLENGE TOTAL XP */}

          <div className="xp-card">
            <span className="xp-card-label">
              Challenge total XP
            </span>

            <div className="xp-value">
              {totalXp}
              <span> XP</span>
            </div>

            <p>
              Sum of the activities. Students
              earn each amount as it is
              verified.
            </p>
          </div>

          {/* =============================
              NEW: FINAL XP
              ============================= */}

          <div className="engine-field">
            <label htmlFor="challenge-final-xp">
              Final XP
            </label>

            <input
              id="challenge-final-xp"
              name="finalXp"
              type="number"
              min="0"
              className="engine-input"
              value={form.finalXp}
              onChange={handleChange}
            />

            <p>
              Accept or adjust the final XP
              before publishing.
            </p>
          </div>

          {/* REWARDS */}

          <div className="engine-field">
            <label>
              Rewards on completion
            </label>

            <div className="engine-input">
              {getRewardSummary(rewards)}
            </div>

            <p>
              Issued once every activity is
              verified.
            </p>
          </div>

          {/* STATUS */}

          <div className="engine-field">
            <label>
              Status
            </label>

            <div className="engine-input">
              Draft
            </div>

            <p>
              The challenge becomes Active
              after students are assigned and
              it is published.
            </p>
          </div>
        </div>

        {/* BUTTONS */}

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

/* =========================================
   SELECT FIELD
   ========================================= */

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

/* =========================================
   REWARD SUMMARY
   ========================================= */

function getRewardSummary(rewards) {
  const selected = [];

  if (rewards.badge) {
    selected.push("Badge");
  }

  if (rewards.certificate) {
    selected.push("Certificate");
  }

  if (rewards.trophy) {
    selected.push("Trophy");
  }

  if (rewards.unlock) {
    selected.push("Unlock");
  }

  if (rewards.employerRecommendation) {
    selected.push(
      "Employer recommendation"
    );
  }

  if (rewards.leaderboardPosition) {
    selected.push(
      "Leaderboard position"
    );
  }

  if (rewards.bonusXp) {
    selected.push("Bonus XP");
  }

  if (selected.length === 0) {
    return "XP only";
  }

  return selected.join(" + ");
}