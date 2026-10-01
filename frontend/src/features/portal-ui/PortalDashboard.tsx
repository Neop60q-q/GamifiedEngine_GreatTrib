export function PortalDashboard() {
  return (
    <div>
      <div className="portal-heading">
        <p>DASHBOARD</p>
        <h1>Good morning, Northline Studio</h1>
        <span>Manage tasks, rewards and student completions.</span>
      </div>
      <div className="portal-stat-grid">
        {[
          ["6", "Active activities"],
          ["2", "Active challenges"],
          ["34", "Students assigned"],
          ["5", "Pending approvals"],
        ].map((s, i) => (
          <div className={i === 3 ? "warn" : ""} key={s[1]}>
            <strong>{s[0]}</strong>
            <span>{s[1]}</span>
          </div>
        ))}
      </div>
      <h2 className="portal-h2">Recent tasks</h2>
      <div className="portal-table">
        <div className="head">
          <span>Activity / Challenge</span>
          <span>Status</span>
          <span>Assigned</span>
          <span>Reward</span>
        </div>
        {[
          ["Attend Career Workshop", "Active", "12", "120 XP"],
          ["Secure API Challenge", "Active", "22", "300 XP"],
          ["Portfolio Sprint", "Draft", "—", "275 XP"],
        ].map((r) => (
          <div key={r[0]}>
            <strong>{r[0]}</strong>
            <span>{r[1]}</span>
            <span>{r[2]}</span>
            <b>{r[3]}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
