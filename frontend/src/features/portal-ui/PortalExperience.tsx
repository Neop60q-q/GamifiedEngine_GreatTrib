import { useState, type ReactNode } from "react";
import { PortalShell } from "../ui-kit/GamificationUI";
import { PortalDashboard } from "./PortalDashboard";
import { LibraryScreen } from "./LibraryScreen";
import { CreateTaskScreen } from "./CreateTaskScreen";
import { ManageScreen } from "./ManageScreen";
import { ReviewScreen } from "./ReviewScreen";
export function PortalExperience() {
  const [screen, setScreen] = useState("dashboard");
  const views: Record<string, ReactNode> = {
    dashboard: <PortalDashboard />,
    library: <LibraryScreen />,
    create: <CreateTaskScreen />,
    manage: <ManageScreen />,
    review: <ReviewScreen />,
  };
  return (
    <PortalShell active={screen} onNavigate={setScreen}>
      {views[screen]}
    </PortalShell>
  );
}
