import { useNavigate } from "react-router-dom";
import { useManagement } from "../context/ManagementContext";

const pendingReviewItems = [
  {
    id: 2,
    initials: "ML",
    name: "Marcus Lee",
    activity: "Complete Employer Assessment",
    xp: "+250 XP",
    time: "5h ago",
  },
  {
    id: 3,
    initials: "PS",
    name: "Priya Sharma",
    activity: "Attend a career workshop",
    xp: "+100 XP",
    time: "1d ago",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { items } = useManagement();

  /*
   * These two values are dynamic.
   * Publishing an item changes its status to Active,
   * so these counts update automatically.
   */
  const activeActivities = items.filter(
    (item) =>
      item.type === "Activity" &&
      item.status === "Active"
  ).length;

  const activeChallenges = items.filter(
    (item) =>
      item.type === "Challenge" &&
      item.status === "Active"
  ).length;

  /*
   * Keep 34 from the original prototype for now.
   * It represents unique students, so we should not
   * calculate it by simply adding assignment counts.
   */
  const studentsAssigned = 34;

  const pendingApprovals = items.reduce(
    (total, item) => total + item.pending,
    0
  );

  return (
    <main className="dashboard-page">
      <h1>
        Good morning, Northline Studio
      </h1>

      <div className="dashboard-stats">
        <StatCard
          value={activeActivities}
          label="Active activities"
        />

        <StatCard
          value={activeChallenges}
          label="Active challenges"
        />

        <StatCard
          value={studentsAssigned}
          label="Students assigned"
        />

        <StatCard
          value={pendingApprovals}
          label="Pending approvals"
          highlighted
        />
      </div>

      <section className="dashboard-section">
        <h2>
          Activities &amp; challenges
        </h2>

        <div className="dashboard-table">
          <div className="dashboard-table-header">
            <span>
              Activity / Challenge
            </span>

            <span>Status</span>
            <span>Assigned</span>
          </div>

          {items.map((item) => (
            <div
              className="dashboard-table-row"
              key={item.id}
            >
              <span className="dashboard-item-title">
                {item.title}
              </span>

              <span>
                <span
                  className={`dashboard-status ${
                    item.status === "Active"
                      ? "active"
                      : "draft"
                  }`}
                >
                  {item.status}
                </span>
              </span>

              <span>
                {item.assigned}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-section dashboard-pending-section">
        <h2>Pending approvals</h2>

        <div className="pending-approval-list">
          {pendingReviewItems.map((item) => (
            <div
              className="pending-approval-row"
              key={item.id}
            >
              <span className="dashboard-avatar">
                {item.initials}
              </span>

              <div className="pending-student">
                <strong>
                  {item.name}
                </strong>

                <span>
                  {item.activity}
                </span>
              </div>

              <span className="pending-xp">
                {item.xp}
              </span>

              <span className="pending-badge">
                Pending review
              </span>

              <span className="pending-time">
                {item.time}
              </span>

              <button
                type="button"
                className="review-outline-button"
                onClick={() =>
                  navigate(
                    `/management/reviews/${item.id}`
                  )
                }
              >
                Review
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function StatCard({
  value,
  label,
  highlighted = false,
}) {
  return (
    <div
      className={`dashboard-stat-card ${
        highlighted
          ? "highlighted"
          : ""
      }`}
    >
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}