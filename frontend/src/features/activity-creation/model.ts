export const factorOptions = {
  difficulty: ["VERY_EASY", "EASY", "MODERATE", "DIFFICULT", "EXPERT"],
  estimated_time_unit: ["MINUTES", "HOURS", "DAYS", "WEEKS", "MONTHS"],
  skill_level: ["NONE", "BEGINNER", "INTERMEDIATE", "ADVANCED", "PROFESSIONAL"],
  effort: ["MINIMAL", "LOW", "MODERATE", "HIGH", "INTENSIVE"],
  complexity: [
    "SINGLE_STEP",
    "TWO_STEP",
    "MULTIPLE_STEPS",
    "MULTI_STAGE",
    "ONGOING",
  ],
  student_impact: [
    "LOW",
    "MODERATE",
    "HIGH",
    "SIGNIFICANT",
    "TRANSFORMATIONAL",
  ],
  verification_method: [
    "AUTOMATIC",
    "SELF_DECLARATION",
    "EDUCATOR_APPROVAL",
    "EMPLOYER_APPROVAL",
    "MANUAL_REVIEW",
  ],
  repeatability: ["ONE_TIME", "DAILY", "WEEKLY", "MONTHLY", "UNLIMITED"],
  completion_type: [
    "COMPLETION",
    "PASS_FAIL",
    "SCORE_BASED",
    "ATTENDANCE",
    "SUBMISSION",
    "EMPLOYER_ACCEPTED",
  ],
} as const;
export type FactorKey = keyof typeof factorOptions;
export type Factors = {
  [K in FactorKey]: (typeof factorOptions)[K][number];
} & { estimated_time_value: number };
export const defaultFactors: Factors = {
  difficulty: "MODERATE",
  estimated_time_value: 2,
  estimated_time_unit: "HOURS",
  skill_level: "BEGINNER",
  effort: "MODERATE",
  complexity: "MULTIPLE_STEPS",
  student_impact: "HIGH",
  verification_method: "EDUCATOR_APPROVAL",
  repeatability: "ONE_TIME",
  completion_type: "ATTENDANCE",
};
export type Activity = {
  external_id: string;
  title: string;
  category?: string;
  final_xp: number | null;
  status: "Draft" | "Active" | "Inactive";
};
export type Draft = Activity & { description: string; factors: Factors };
export type ActivityCreate = {
  creator_external_id: string;
  creator_role: "EDUCATOR" | "EMPLOYER";
  external_id: string;
  title: string;
  description: string;
  category: string;
  factors: Factors;
  status: Activity["status"];
};
