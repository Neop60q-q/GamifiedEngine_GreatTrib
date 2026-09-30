import { useState } from "react";

import { useManagement } from "../context/ManagementContext";

const filters = [
  "All",
  "Active",
  "Draft",
  "Completed",
];

export default function ManageAssignments() {
  const [filter, setFilter] = useState("All");

  const { items } = useManagement();

  const visibleAssignments =
    filter === "All"
      ? items
      : items.filter(
          (item) => item.status === filter
        );

  return (
    <main className="assignments-page">
      <h1>Manage Assignments</h1>

      <div className="assignment-filters">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            className={`assignment-filter ${
              filter === item ? "active" : ""
            }`}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="assignments-table">
        <div className="assignment-table-header">
          <span className="assignment-title-column">
            Activity / Challenge
          </span>

          <span>Status</span>
          <span>Assigned</span>
          <span>Completed</span>
          <span>Pending review</span>
        </div>

        {visibleAssignments.map(
          (assignment) => (
            <div
              className="assignment-row"
              key={assignment.id}
            >
              <span className="assignment-title-column assignment-title">
                {assignment.title}
              </span>

              <span>
                <span
                  className={`assignment-status ${assignment.status.toLowerCase()}`}
                >
                  {assignment.status}
                </span>
              </span>

              <span>
                {assignment.assigned}
              </span>

              <span>
                {assignment.completed}
              </span>

              <span>
                {assignment.pending}
              </span>
            </div>
          )
        )}
      </div>
    </main>
  );
}