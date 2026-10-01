export function ReviewScreen() {
  return (
    <div>
      <div className="portal-heading">
        <p>REVIEW</p>
        <h1>Pending approvals</h1>
        <span>
          Approve student evidence before XP, achievements and rewards are
          granted.
        </span>
      </div>
      <div className="review-native-list">
        {[
          ["Jack Brown", "Secure API Challenge", "300 XP"],
          ["Marcus Lee", "Employer Assessment", "250 XP"],
          ["Priya Sharma", "Resume Draft", "45 XP"],
        ].map((r) => (
          <article key={r[0]}>
            <div className="review-avatar">
              {r[0]
                .split(" ")
                .map((x) => x[0])
                .join("")}
            </div>
            <div>
              <strong>{r[0]}</strong>
              <span>{r[1]}</span>
            </div>
            <b>{r[2]}</b>
            <button className="reject">Reject</button>
            <button>Approve</button>
          </article>
        ))}
      </div>
    </div>
  );
}
