import { useState, type ReactNode } from "react";
import { StudentShell, type ScreenName } from "../ui-kit/GamificationUI";
import { StudentDashboard } from "./StudentDashboard";
import LearnScreen, { type LearnTab } from "./LearnScreen";
import { ProfileScreen } from "./ProfileScreen";
import { MessagesScreen } from "./MessagesScreen";
import { EarnScreen } from "./EarnScreen";
import { CompleteScreen } from "./CompleteScreen";
import { AvatarScreen } from "./AvatarScreen";
import { HubScreen } from "./HubScreen";
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
  const [hubOpen, setHubOpen] = useState(false);

  function refreshProgress() {
    setProgressVersion((v) => v + 1);
  }
  function openLearn(tab: LearnTab) {
    setLearnTab(tab);
    setScreen("learn");
  }

  if (hubOpen) {
    return (
      <StudentShell screen="avatar" onNavigate={setScreen} hideNavigation>
        <HubScreen onBack={() => setHubOpen(false)} />
      </StudentShell>
    );
  }

  if (screen === "complete" && completion) {
    return (
      <StudentShell screen={screen} onNavigate={setScreen} hideNavigation>
        <CompleteScreen
          completion={completion}
          onViewProgress={() => openLearn("progress")}
          onFindAnother={() => openLearn("challenges")}
        />
      </StudentShell>
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
    avatar: <AvatarScreen onEnterHub={() => setHubOpen(true)} />,
    profile: <ProfileScreen progressVersion={progressVersion} />,
    complete: null,
  } satisfies Record<ScreenName, ReactNode>;

  return (
    <StudentShell screen={screen} onNavigate={setScreen}>
      {content[screen]}
    </StudentShell>
  );
}
