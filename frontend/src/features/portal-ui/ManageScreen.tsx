export function ManageScreen() {
  return (
    <div>
      <div className="portal-heading">
        <p>MANAGE</p>
        <h1>Published tasks</h1>
        <span>
          Review active, draft and completed activities and challenges.
        </span>
      </div>
      <div className="portal-table manage">
        <div className="head">
          <span>Task</span>
          <span>Type</span>
          <span>Status</span>
          <span>Students</span>
        </div>
        {[
          ["Secure API Challenge", "Challenge", "Active", "22"],
          ["Career Workshop", "Activity", "Active", "12"],
          ["Portfolio Sprint", "Challenge", "Draft", "—"],
          ["Resume Draft", "Activity", "Active", "18"],
        ].map((r) => (
          <div key={r[0]}>
            <strong>{r[0]}</strong>
            <span>{r[1]}</span>
            <span className="status-dot">{r[2]}</span>
            <b>{r[3]}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
