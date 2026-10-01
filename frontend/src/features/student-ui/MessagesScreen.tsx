export function MessagesScreen() {
  return (
    <div className="messages-figma-screen">
      <header className="simple-purple-hero">
        <div className="simple-hero-decoration" />
        <div className="simple-title-row">
          <h1>Messages</h1>
          <button className="round-icon" aria-label="New message">
            <span className="material-symbols-outlined">edit_square</span>
          </button>
        </div>
      </header>
      <main className="messages-content">
        <div className="message-search">
          <span className="material-symbols-outlined">search</span>
          <span>Search messages</span>
        </div>
        <article className="message-row">
          <div className="message-avatar">NS</div>
          <div>
            <div className="message-name-row">
              <strong>Northline Studio</strong>
              <span>10:24</span>
            </div>
            <p>Thanks for completing the Portfolio Sprint.</p>
          </div>
          <span className="unread-dot" />
        </article>
        <article className="message-row">
          <div className="message-avatar purple">P</div>
          <div>
            <div className="message-name-row">
              <strong>Priya</strong>
              <span>Tue</span>
            </div>
            <p>Anyone joining the Portfolio Sprint?</p>
          </div>
        </article>
        <article className="message-row">
          <div className="message-avatar orange">
            <span className="material-symbols-outlined">school</span>
          </div>
          <div>
            <div className="message-name-row">
              <strong>Alumable Campus</strong>
              <span>Mon</span>
            </div>
            <p>Welcome to the Alumable Campus Hub.</p>
          </div>
        </article>
      </main>
    </div>
  );
}
