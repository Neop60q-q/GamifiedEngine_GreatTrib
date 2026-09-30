import { useMemo, useState } from "react";

import LibraryCard from "../components/LibraryCard";
import LibraryFilters from "../components/LibraryFilters";

import { useNavigate } from "react-router-dom";

const libraryItems = [
  {
    id: 1,
    type: "Challenge",
    title: "Attend a career workshop",
    description:
      "Register, attend and share one takeaway. Three activities.",
    meta: "Moderate · 1–2 hrs · 3 activities",
    xp: "~100 XP",
  },
  {
    id: 2,
    type: "Activity · Phase One",
    title: "Upload Resume Draft",
    description:
      "Submit a resume draft for educator feedback and credit.",
    meta: "Moderate · 30 min",
    xp: "~45 XP",
  },
  {
    id: 3,
    type: "Challenge",
    title: "Portfolio Sprint with Northline Studio",
    description:
      "Five activities culminating in employer portfolio review.",
    meta: "Hard · one week · five activities",
    xp: "~275 XP",
  },
  {
    id: 4,
    type: "Activity · Phase One",
    title: "Complete Employer Assessment",
    description:
      "Scenario-based task reviewed and approved by your team.",
    meta: "Difficult · 3 hrs · employer approval",
    xp: "~250 XP",
  },
  {
    id: 5,
    type: "Activity · Phase One",
    title: "Daily Login Streak",
    description:
      "Automatic credit for returning to the platform daily.",
    meta: "Very easy · 10 min",
    xp: "~5 XP",
  },
  {
    id: 6,
    type: "Challenge",
    title: "Build your portfolio",
    description:
      "Assemble three pieces of work with written context.",
    meta: "Moderate · 2 weeks · 4 activities",
    xp: "~150 XP",
  },
];

export default function Library() {
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const visibleItems = useMemo(() => {
    if (filter === "all") {
      return libraryItems;
    }

    if (filter === "activity") {
      return libraryItems.filter((item) =>
        item.type.toLowerCase().startsWith("activity")
      );
    }

    if (filter === "challenge") {
      return libraryItems.filter((item) =>
        item.type.toLowerCase().startsWith("challenge")
      );
    }

    return libraryItems;
  }, [filter]);

  return (
    <main className="library-page">
      <div className="library-heading-row">
        <div>
          <h1>Library</h1>
          <p className="library-intro">
            Browse and assign learning activities and challenges.
          </p>
        </div>

        <button type="button" className="new-template-button">
          <span className="material-symbols-outlined">add</span>
          New template
        </button>
      </div>

      <LibraryFilters value={filter} onChange={setFilter} />

      <section className="library-grid" aria-label="Learning library items">
        {visibleItems.map((item) => (
          <LibraryCard
            type={item.type}
            title={item.title}
            description={item.description}
            meta={item.meta}
            xp={item.xp}
            onClick={() => {
              const isActivity = item.type
                .toLowerCase()
                .startsWith("activity");

              if (isActivity) {
                navigate("/management/activities/create");
              } else {
                navigate("/management/challenges/create");
              }
            }}
          />
        ))}
      </section>
    </main>
  );
}
