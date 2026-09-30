import {
  createContext,
  useContext,
  useState,
} from "react";

const ManagementContext = createContext(null);

const initialItems = [
  {
    id: "portfolio-sprint",
    title: "Portfolio Sprint with Northline Studio",
    description:
      "Five activities culminating in employer portfolio review.",
    type: "Challenge",
    status: "Draft",

    difficulty: "Hard",
    expectedTime: "One Week",
    goal: "Complete five activities",
    challengeType: "Learning",
    employerSponsored: "Yes — Northline Studio",

    skills: [
      "Portfolio",
      "Communication",
      "Industry Experience",
    ],

    activities: [
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
    ],

    rewards: {
      xp: true,
      badge: true,
      trophy: false,
      unlock: false,
      certificate: true,
      bonusXp: false,
      employerRecommendation: false,
      leaderboardPosition: false,
    },

    creatorType: "Educator",
    creatorId: "educator-demo-001",

    recommendedXp: 275,
    finalXp: 275,

    assigned: 18,
    completed: 0,
    pending: 1,
  },

  {
    id: "career-workshop",
    title: "Attend a career workshop",
    description:
      "Register, attend and share one takeaway.",
    type: "Challenge",
    status: "Active",

    recommendedXp: 100,
    finalXp: 100,

    assigned: 30,
    completed: 12,
    pending: 0,
  },

  {
    id: "resume",
    title: "Upload Your Resume",
    description:
      "Draft your resume using the Alumable template and upload it for feedback.",
    type: "Activity",
    status: "Draft",

    category: "Profile",
    difficulty: "Moderate",
    completionTime: "10–30 minutes",
    skillLevel: "Beginner",
    effort: "Low",
    complexity: "Single Step",
    impact: "Moderate",
    verification: "Educator Approval",
    repeatability: "One Time",
    completionType: "Submission",

    startDate: "2026-09-01",
    endDate: "2026-09-30",

    recommendedXp: 45,
    finalXp: 45,

    assigned: 22,
    completed: 9,
    pending: 1,
  },

  {
    id: "employer-assessment",
    title: "Complete Employer Assessment",
    description:
      "Complete an employer assessment for review.",
    type: "Activity",
    status: "Active",

    difficulty: "Difficult",
    recommendedXp: 250,
    finalXp: 250,

    assigned: 22,
    completed: 14,
    pending: 1,
  },
];

export function ManagementProvider({ children }) {
  const [items, setItems] = useState(initialItems);

  const [currentItemId, setCurrentItemId] =
    useState(null);

  const getItem = (id) => {
    return items.find((item) => item.id === id);
  };

  const updateItem = (id, updates) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
            }
          : item
      )
    );
  };

  const setItemStatus = (id, status) => {
    updateItem(id, { status });
  };

  const saveDraft = (id, updates = {}) => {
    updateItem(id, {
      ...updates,
      status: "Draft",
    });
  };

  const publishItem = (id) => {
    setItemStatus(id, "Active");
  };

  return (
    <ManagementContext.Provider
      value={{
        items,

        currentItemId,
        setCurrentItemId,

        getItem,
        updateItem,
        saveDraft,
        publishItem,
      }}
    >
      {children}
    </ManagementContext.Provider>
  );
}

export function useManagement() {
  const context = useContext(ManagementContext);

  if (!context) {
    throw new Error(
      "useManagement must be used inside ManagementProvider"
    );
  }

  return context;
}