import { useState, type ReactNode } from "react";
import { StudentShell, type ScreenName } from "../ui-kit/GamificationUI";
import { StudentDashboard } from "./StudentDashboard";
import LearnScreen, { type LearnTab } from "./LearnScreen";
import { ProfileScreen } from "./ProfileScreen";
import { MessagesScreen } from "./MessagesScreen";
import { EarnScreen } from "./EarnScreen";
import { CompleteScreen } from "./CompleteScreen";
import type { CompletionResult } from "../xp/api";
import type { PersistedActivity } from "../activity-creation/api";

export type CompletionView = {
  activity: PersistedActivity;
  result: CompletionResult;
};

export function StudentExperience() {
  const [screen, setScreen] = useState<ScreenName>("dashboard");
  const [learnTab, setLearnTab] = useState<LearnTab>("progress");
  const [progressVersion, setProgressVersion] = useState(0);
  const [completion, setCompletion] = useState<CompletionView | null>(null);

  function refreshProgress() {
    setProgressVersion((v) => v + 1);
  }
  function openLearn(tab: LearnTab) {
    setLearnTab(tab);
    setScreen("learn");
  }

  if (screen === "complete" && completion) {
    return (
      <CompleteScreen
        completion={completion}
        onViewProgress={() => openLearn("progress")}
        onFindAnother={() => openLearn("challenges")}
      />
    );
  }

  const content = {
    dashboard: (
      <StudentDashboard
        refreshKey={progressVersion}
        onViewChallenges={() => openLearn("challenges")}
      />
    ),
    learn: (
      <LearnScreen
        initialTab={learnTab}
        progressVersion={progressVersion}
        onTabChange={setLearnTab}
        onProgressChanged={refreshProgress}
        onCompleted={(activity, result) => {
          refreshProgress();
          setCompletion({ activity, result });
          setScreen("complete");
        }}
      />
    ),
    earn: <EarnScreen />,
    messages: <MessagesScreen />,
    profile: <ProfileScreen progressVersion={progressVersion} />,
    complete: null,
  } satisfies Record<ScreenName, ReactNode>;

  return (
    <StudentShell screen={screen} onNavigate={setScreen}>
      {content[screen]}
    </StudentShell>
  );
}
