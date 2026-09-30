import { useNavigate, useParams } from "react-router-dom";

const reviewItems = [
  {
    id: "1",
    initials: "JB",
    name: "Jack Brown",
    activity: "Portfolio Sprint with Northline Studio",
    type: "Challenge",
    time: "3h ago",
    verification: "Employer approval",
    xp: "275 XP",
    description:
      "Challenge submitted for employer review · 5 of 5 activities complete",
    submission:
      "All five activities are done — brief call, three work samples, the case study, two peer reviews and the final portfolio. Submitting the sprint for your review.",
    files: "portfolio-sprint-submission · 6 files",
  },
  {
    id: "2",
    initials: "ML",
    name: "Marcus Lee",
    activity: "Complete Employer Assessment",
    type: "Activity",
    time: "5h ago",
    verification: "Employer approval",
    xp: "250 XP",
    description: "Activity submitted for employer review",
    submission:
      "Employer assessment completed and submitted for verification.",
    files: "employer-assessment-submission · 1 file",
  },
  {
    id: "3",
    initials: "PS",
    name: "Priya Sharma",
    activity: "Attend a career workshop",
    type: "Challenge",
    time: "1d ago",
    verification: "Educator approval",
    xp: "100 XP",
    description: "Challenge submitted for review",
    submission:
      "Career workshop attendance and reflection submitted for verification.",
    files: "career-workshop-submission · 2 files",
  },
];

export default function ReviewCompletion() {
  const navigate = useNavigate();
  const { id } = useParams();

  const selectedReview =
    reviewItems.find((item) => item.id === id) ||
    reviewItems[0];

  const openReview = (reviewId) => {
    navigate(`/management/reviews/${reviewId}`);
  };

  return (
    <main className="review-completion-page">
      {/* LEFT SIDE */}
      <section className="review-submission-list">
        <h1>Review &amp; Verify Completion</h1>

        <div className="review-student-list">
          {reviewItems.map((item) => {
            const isSelected =
              item.id === selectedReview.id;

            return (
              <button
                type="button"
                key={item.id}
                className={`review-student-item ${
                  isSelected ? "selected" : ""
                }`}
                onClick={() => openReview(item.id)}
              >
                <span
                  className={`review-avatar avatar-${item.id}`}
                >
                  {item.initials}
                </span>

                <div className="review-student-info">
                  <strong>{item.name}</strong>
                  <span>{item.activity}</span>
                </div>

                <time>{item.time}</time>
              </button>
            );
          })}
        </div>
      </section>

      {/* RIGHT REVIEW PANEL */}
      <section className="submission-review-card">
        <div className="submission-review-header">
          <div>
            <span className="submission-label">
              SUBMISSION
            </span>

            <h2>{selectedReview.activity}</h2>

            <p>{selectedReview.description}</p>
          </div>

          <button
            type="button"
            className="close-review-button"
            aria-label="Close review"
            onClick={() =>
              navigate("/management/reviews")
            }
          >
            <span className="material-symbols-outlined">
              close
            </span>
          </button>
        </div>

        <div className="submission-meta">
          <div>
            <span>Verification method</span>
            <strong>
              {selectedReview.verification}
            </strong>
          </div>

          <div>
            <span>Recommended XP</span>

            <strong className="recommended-xp">
              {selectedReview.xp}
            </strong>
          </div>
        </div>

        <div className="submission-content">
          <p>{selectedReview.submission}</p>

          <div className="submission-files">
            <span className="material-symbols-outlined">
              folder
            </span>

            {selectedReview.files}
          </div>
        </div>

        <label
          className="review-note-label"
          htmlFor="review-note"
        >
          Reviewer note (optional)
        </label>

        <textarea
          id="review-note"
          className="review-note"
        />

        <div className="review-decision-actions">
          <button
            type="button"
            className="reject-button"
          >
            Reject
          </button>

          <button
            type="button"
            className="approve-button"
          >
            Approve
          </button>
        </div>
      </section>
    </main>
  );
}