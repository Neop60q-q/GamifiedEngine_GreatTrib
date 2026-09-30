import { useState } from "react";
import { useNavigate } from "react-router-dom";

const submissions = [
  {
    id: 1,
    initials: "JB",
    name: "Jack Brown",
    type: "Challenge",
    item: "Portfolio Sprint with Northline Studio",
    submitted: "3h ago",
  },
  {
    id: 2,
    initials: "ML",
    name: "Marcus Lee",
    type: "Activity",
    item: "Complete Employer Assessment",
    submitted: "5h ago",
  },
  {
    id: 3,
    initials: "PS",
    name: "Priya Sharma",
    type: "Challenge",
    item: "Attend a career workshop",
    submitted: "1d ago",
  },
];

export default function ReviewQueue() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const visibleSubmissions = submissions.filter((submission) => {
    const matchesFilter =
      filter === "All" ||
      submission.type === filter.slice(0, -1);

    const query = search.toLowerCase();

    const matchesSearch =
      submission.name.toLowerCase().includes(query) ||
      submission.item.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  return (
    <main className="review-queue-page">
      <h1>Review queue</h1>

      <p className="review-queue-description">
        Three submissions are waiting on verification.
        Select one to review it.
      </p>

      <div className="review-toolbar">
        <div className="review-filters">
          {["All", "Activities", "Challenges"].map(
            (item) => (
              <button
                type="button"
                key={item}
                className={`review-filter ${
                  filter === item ? "active" : ""
                }`}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            )
          )}
        </div>

        <div className="review-search">
          <span className="material-symbols-outlined">
            search
          </span>

          <input
            type="text"
            placeholder="Search submissions"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>
      </div>

      <div className="review-table">
        <div className="review-table-header">
          <span />
          <span>Student</span>
          <span>Activity / Challenge</span>
          <span>Submitted</span>
          <span>Status</span>
          <span />
        </div>

        {visibleSubmissions.map((submission) => (
          <div
            className="review-table-row"
            key={submission.id}
          >
            <span
              className={`review-avatar avatar-${submission.id}`}
            >
              {submission.initials}
            </span>

            <strong>{submission.name}</strong>

            <span>{submission.item}</span>

            <span>{submission.submitted}</span>

            <span>
              <span className="pending-badge">
                Pending review
              </span>
            </span>

            <span>
              <button
                type="button"
                className="review-outline-button"
                onClick={() =>
                  navigate(
                    `/management/reviews/${submission.id}`
                  )
                }
              >
                Review
              </button>
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}