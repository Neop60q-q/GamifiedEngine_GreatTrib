import { NavLink } from "react-router-dom";

const navigation = [
  {
    label: "Dashboard",
    icon: "dashboard",
    to: "/management/dashboard",
  },
  {
    label: "Library",
    icon: "library_books",
    to: "/management/library",
  },
  {
    label: "Assignments",
    icon: "assignment",
    to: "/management/assignments",
  },
  {
    label: "Review queue",
    icon: "fact_check",
    to: "/management/reviews",
  },
];

export default function ManagementSidebar() {
  return (
    <aside className="management-sidebar">
      <div className="management-brand">
        <span className="management-brand-mark" />
        <span className="management-brand-name">
          alumable
        </span>
      </div>

      <nav className="management-nav">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `management-nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="material-symbols-outlined">
              {item.icon}
            </span>

            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}