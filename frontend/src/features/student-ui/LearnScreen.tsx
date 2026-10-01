import { useEffect, useState } from "react";
import ProgressScreen from "./ProgressScreen";
import ChallengesScreen from "./ChallengesScreen";
import SubjectsScreen from "./SubjectsScreen";
import type { CompletionResult } from "../xp/api";
import type { PersistedActivity } from "../activity-creation/api";

export type LearnTab = "progress" | "subjects" | "challenges";
type Props = {
  initialTab?: LearnTab;
  progressVersion?: number;
  onTabChange?: (tab: LearnTab) => void;
  onProgressChanged?: () => void;
  onCompleted?: (activity: PersistedActivity, result: CompletionResult) => void;
};
export default function LearnScreen({
  initialTab = "progress",
  progressVersion = 0,
  onTabChange,
  onProgressChanged,
  onCompleted,
}: Props) {
  const [activeTab, setActiveTab] = useState<LearnTab>(initialTab);
  useEffect(() => setActiveTab(initialTab), [initialTab]);
  function select(tab: LearnTab) {
    setActiveTab(tab);
    onTabChange?.(tab);
  }
  return (
    <div className="learn-screen">
      <div className="learn-header">
        <div className="learn-header-decoration" />
        <div className="learn-title-row">
          <h1>Learn</h1>
          <button className="find-peers-button">
            <span className="material-symbols-outlined">group</span>Find peers
          </button>
        </div>
        <div className="learn-tabs">
          {(["progress", "subjects", "challenges"] as LearnTab[]).map((tab) => (
            <button
              key={tab}
              className={`learn-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => select(tab)}
            >
              {tab[0].toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="learn-content">
        {activeTab === "progress" && (
          <ProgressScreen progressVersion={progressVersion} />
        )}{" "}
        {activeTab === "subjects" && <SubjectsScreen />}{" "}
        {activeTab === "challenges" && (
          <ChallengesScreen
            onProgressChanged={onProgressChanged}
            onCompleted={onCompleted}
          />
        )}
      </div>
    </div>
  );
}
