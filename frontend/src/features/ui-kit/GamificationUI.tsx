import type { ReactNode } from "react";

export type ScreenName =
  | "dashboard"
  | "learn"
  | "earn"
  | "messages"
  | "profile"
  | "complete";

export function Icon({ children }: { children: string }) {
  return <span className="material-symbols-outlined">{children}</span>;
}

export function XPBar({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label?: string;
}) {
  const safeMax = Math.max(max, 1);
  const pct = Math.min(100, Math.round((value / safeMax) * 100));
  return (
    <div className="g-xpbar">
      <div className="g-xpbar-head">
        <span>
          {label ?? `${value.toLocaleString()} / ${max.toLocaleString()} XP`}
        </span>
        <strong>{pct}%</strong>
      </div>
      <div className="g-xpbar-track">
        <span style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
export function SkillBar({
  name,
  level,
  xp,
  max,
  tone = "purple",
}: {
  name: string;
  level: number;
  xp: number;
  max: number;
  tone?: string;
}) {
  return (
    <div className="g-skill">
      <div>
        <strong>{name}</strong>
        <span>Level {level}</span>
      </div>
      <div className={`g-skill-track ${tone}`}>
        <span
          style={{ width: `${Math.min(100, (xp / Math.max(max, 1)) * 100)}%` }}
        />
      </div>
      <small>
        {xp} / {max} XP
      </small>
    </div>
  );
}
export function StudentShell({
  screen,
  onNavigate,
  children,
  hideNavigation = false,
}: {
  screen: ScreenName;
  onNavigate: (s: ScreenName) => void;
  children: ReactNode;
  hideNavigation?: boolean;
}) {
  const nav: [ScreenName, string, string][] = [
    ["dashboard", "home", "Home"],
    ["learn", "school", "Learn"],
    ["earn", "work", "Earn"],
    ["messages", "chat_bubble", "Messages"],
    ["profile", "person", "Profile"],
  ];
  return (
    <div className="student-stage">
      <div className="student-ui-shell">
        <main className="student-screen">{children}</main>
        {!hideNavigation && (
          <nav className="student-bottom">
            {nav.map(([id, icon, label]) => (
              <button
                key={id}
                className={screen === id ? "active" : ""}
                onClick={() => onNavigate(id)}
              >
                <span className="nav-pill">
                  <Icon>{icon}</Icon>
                </span>
                <span>{label}</span>
              </button>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
export function PortalShell({
  active,
  children,
  onNavigate,
}: {
  active: string;
  children: ReactNode;
  onNavigate: (v: string) => void;
}) {
  const nav = [
    ["dashboard", "dashboard", "Dashboard"],
    ["library", "library_books", "Library"],
    ["create", "add_circle", "Create task"],
    ["manage", "assignment", "Assignments"],
    ["review", "fact_check", "Review queue"],
  ];
  return (
    <div className="portal-stage">
      <div className="portal-native">
        <aside className="portal-native-side">
          <div className="portal-native-brand">
            <span className="brand-dot"></span>
            <b>alumable</b>
          </div>
          {nav.map(([id, icon, label]) => (
            <button
              className={active === id ? "active" : ""}
              onClick={() => onNavigate(id)}
              key={id}
            >
              <Icon>{icon}</Icon>
              <span>{label}</span>
            </button>
          ))}
          <div className="portal-side-foot">
            <span>NS</span>
            <div>
              <strong>Northline Studio</strong>
              <small>Employer / educator</small>
            </div>
          </div>
        </aside>
        <section className="portal-native-main">{children}</section>
      </div>
    </div>
  );
}
