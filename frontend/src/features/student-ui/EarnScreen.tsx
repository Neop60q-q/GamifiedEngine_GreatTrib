export function EarnScreen() {
  return (
    <div className="earn-figma-screen">
      <header className="earn-hero">
        <div className="earn-decoration" />
        <div className="earn-title-row">
          <div>
            <h1>Earn</h1>
            <p>Find your next gig</p>
          </div>
          <button className="round-icon" aria-label="Search gigs">
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>
        <div className="earn-summary">
          <div>
            <span>My gigs</span>
            <strong>0</strong>
          </div>
          <div>
            <span>Your earnings</span>
            <strong>$0.00</strong>
            <small>Total this month</small>
          </div>
        </div>
      </header>
      <main className="earn-content">
        <div className="section-title-row">
          <h2>All gigs</h2>
          <button className="filter-icon" aria-label="Filter">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
        <article className="gig-card">
          <div className="gig-icon">
            <span className="material-symbols-outlined">campaign</span>
          </div>
          <div className="gig-copy">
            <h3>Social content assistant</h3>
            <p>Northline Studio · remote · 6 hrs/wk</p>
            <div className="gig-tags">
              <span>Level 2+</span>
              <span>Beginner</span>
            </div>
          </div>
          <span className="material-symbols-outlined gig-arrow">
            chevron_right
          </span>
        </article>
        <article className="gig-card locked">
          <div className="gig-icon">
            <span className="material-symbols-outlined">analytics</span>
          </div>
          <div className="gig-copy">
            <h3>Junior data analyst — 12 week placement</h3>
            <p>Meridian Health · hybrid</p>
            <div className="locked-label">
              <span className="material-symbols-outlined">lock</span>Unlocks at
              Level 5
            </div>
          </div>
        </article>
        <article className="gig-card locked">
          <div className="gig-icon">
            <span className="material-symbols-outlined">science</span>
          </div>
          <div className="gig-copy">
            <h3>Research assistant, semester project</h3>
            <p>University of Bendigo · on campus</p>
            <div className="locked-label">
              <span className="material-symbols-outlined">lock</span>Unlocks at
              Level 5
            </div>
          </div>
        </article>
        <div className="earn-demo-note">
          <span className="material-symbols-outlined">info</span>
          <p>
            <strong>Prototype preview</strong>
            <br />
            Gig applications and payments are not connected in this prototype.
          </p>
        </div>
      </main>
    </div>
  );
}
