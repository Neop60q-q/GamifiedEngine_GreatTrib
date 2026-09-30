import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useManagement } from "../context/ManagementContext";

const students = [
  {
    id: 1,
    name: "Jack Brown",
    cohort: "BCom Marketing '26",
    level: 4,
    eligible: true,
  },
  {
    id: 2,
    name: "Marcus Lee",
    cohort: "BIT Software '25",
    level: 5,
    eligible: true,
  },
  {
    id: 3,
    name: "Ava Thompson",
    cohort: "BCom Marketing '27",
    level: 1,
    eligible: false,
  },
  {
    id: 4,
    name: "Priya Sharma",
    cohort: "BIT Software '25",
    level: 5,
    eligible: true,
  },
];

export default function AssignStudents() {
  const navigate = useNavigate();

  const {
    currentItemId,
    publishItem,
    setCurrentItemId,
  } = useManagement();

  const [selected, setSelected] = useState([
    1,
    2,
    4,
  ]);

  const [search, setSearch] = useState("");

  const toggleStudent = (student) => {
    if (!student.eligible) return;

    setSelected((current) =>
      current.includes(student.id)
        ? current.filter(
            (id) => id !== student.id
          )
        : [...current, student.id]
    );
  };

  const visibleStudents = students.filter(
    (student) =>
      student.name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const handlePublish = () => {
    if (currentItemId) {
      publishItem(currentItemId);
    }

    setCurrentItemId(null);

    navigate("/management/assignments");
  };

  return (
    <main className="assign-page">
      <h1>Assign to Students</h1>

      <div className="assign-toolbar">
        <div className="student-search">
          <span className="material-symbols-outlined">
            search
          </span>

          <input
            type="text"
            placeholder="Search students"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <button
          type="button"
          className="assign-dropdown"
        >
          <span>Cohort</span>
          <span className="material-symbols-outlined">
            expand_more
          </span>
        </button>

        <button
          type="button"
          className="assign-dropdown"
        >
          <span>Eligible only</span>
          <span className="material-symbols-outlined">
            expand_more
          </span>
        </button>
      </div>

      <div className="student-table">
        <div className="student-table-header">
          <span className="student-check-column" />
          <span className="student-name-column">
            Student
          </span>
          <span className="student-cohort-column">
            Cohort
          </span>
          <span className="student-level-column">
            Level
          </span>
          <span className="student-eligible-column">
            Eligible
          </span>
        </div>

        {visibleStudents.map((student) => {
          const isSelected =
            selected.includes(student.id);

          return (
            <div
              key={student.id}
              className={`student-row ${
                !student.eligible
                  ? "disabled"
                  : ""
              }`}
              onClick={() =>
                toggleStudent(student)
              }
            >
              <span className="student-check-column">
                <span
                  className={`student-checkbox ${
                    isSelected
                      ? "selected"
                      : ""
                  }`}
                >
                  {isSelected && (
                    <span className="material-symbols-outlined">
                      check
                    </span>
                  )}
                </span>
              </span>

              <span className="student-name-column student-name">
                {student.name}
              </span>

              <span className="student-cohort-column">
                {student.cohort}
              </span>

              <span className="student-level-column">
                {student.level}
              </span>

              <span className="student-eligible-column">
                <span
                  className={`eligibility-badge ${
                    student.eligible
                      ? "eligible"
                      : "not-eligible"
                  }`}
                >
                  {student.eligible
                    ? "Eligible"
                    : "Not eligible"}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      <div className="assign-footer">
        <p>
          {selected.length} of 4 students selected
          · 1 not eligible for this activity's
          skill level
        </p>

        <div className="assign-actions">
          <button
            type="button"
            className="assign-back"
            onClick={() => navigate(-1)}
          >
            Back
          </button>

          <button
            type="button"
            className="assign-publish"
            onClick={handlePublish}
          >
            Publish
          </button>
        </div>
      </div>
    </main>
  );
}