import { useLocation } from "../shared/navigation";
import { DesignPrototype } from "../features/design-prototype/DesignPrototype";
import { StudentExperience } from "../features/student-ui/StudentExperience";
import { PortalExperience } from "../features/portal-ui/PortalExperience";

function PrototypeHome() {
  return (
    <main className="prototype-home">
      <section className="prototype-home-card">
        <div className="prototype-home-brand">
          <span>A</span> Alumable
        </div>
        <p className="prototype-home-eyebrow">GAMIFICATION ENGINE PROTOTYPE</p>
        <h1>Prototype showcase</h1>
        <p className="prototype-home-copy">
          Switch between the three prototype views without mixing the student
          and employer/educator experiences.
        </p>
        <nav className="prototype-home-tabs" aria-label="Prototype views">
          <a href="/student-ui">
            <span className="material-symbols-outlined">smartphone</span>
            <strong>Student UI</strong>
            <small>Student mobile experience</small>
          </a>
          <a href="/portal-ui">
            <span className="material-symbols-outlined">dashboard</span>
            <strong>Portal</strong>
            <small>Employer / Educator experience</small>
          </a>
          <a href="/prototype">
            <span className="material-symbols-outlined">web</span>
            <strong>HTML Prototype</strong>
            <small>Original design reference</small>
          </a>
        </nav>
      </section>
    </main>
  );
}

export function App() {
  const page = useLocation().split("?")[0];

  if (page.startsWith("/portal-ui")) return <PortalExperience />;
  if (page.startsWith("/student-ui")) return <StudentExperience />;
  if (page.startsWith("/prototype")) return <DesignPrototype />;

  return <PrototypeHome />;
}
