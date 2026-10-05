export function HubScreen({ onBack }: { onBack: () => void }) {
  return <div className="hub-screen">
    <header className="hub-topbar"><button onClick={onBack}><span className="material-symbols-outlined">arrow_back</span></button><div><small>JACK'S SPACE</small><h1>My Hub</h1></div><span className="hub-status">Prototype</span></header>
    <section className="hub-room">
      <div className="hub-window"><span /><span /></div>
      <div className="hub-shelf"><span>🏆</span><span>⭐</span><span>🎓</span></div>
      <div className="hub-desk"><div className="hub-monitor">Reflection<br/><strong>Diary</strong></div></div>
      <div className="hub-avatar-mini"><span>J</span></div>
      <div className="hub-rug">ALUMABLE</div>
    </section>
    <main className="hub-content">
      <div className="hub-intro"><h2>Your professional space</h2><p>A proof-of-concept home where rewards, career evidence and reflections can live together.</p></div>
      <div className="hub-actions">
        <button><span className="material-symbols-outlined">description</span><div><strong>CV & Portfolio</strong><small>Showcase projects and evidence</small></div><span className="material-symbols-outlined">chevron_right</span></button>
        <button><span className="material-symbols-outlined">menu_book</span><div><strong>Reflection Diary</strong><small>Connect the Alumable reflection project</small></div><span className="hub-soon">Coming soon</span></button>
        <button><span className="material-symbols-outlined">trophy</span><div><strong>Reward Display</strong><small>Show achievements and earned items</small></div><span className="material-symbols-outlined">chevron_right</span></button>
      </div>
    </main>
  </div>;
}
