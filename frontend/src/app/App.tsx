import { useState, type FormEvent, type ReactNode } from 'react';
import { Card, Modal, PageHeading } from '../shared/components';
import { DemoProvider, useDemo } from '../shared/DemoProvider';
import { Link, useLocation } from '../shared/navigation';

function Layout({ children }: { children: ReactNode }) {
  const { reset } = useDemo();
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" href="/">Alumable</Link>
        <nav aria-label="Primary navigation">
          <Link href="/">Dashboard</Link>
          <Link href="/activities">Activities</Link>
          <Link href="/avatar">Avatar</Link>
        </nav>
        <button className="secondary small" onClick={reset}>Reset demo</button>
      </header>
      <main className="content">{children}</main>
    </div>
  );
}

function Dashboard() {
  const { completed, xp, level, next, progress, outfit, complete } = useDemo();
  const assessmentDone = completed.includes('assessment');
  const workshopDone = completed.includes('workshop');
  return (
    <>
      <PageHeading eyebrow="STUDENT DASHBOARD" title="Keep moving forward">
        Complete activities to earn XP and unlock new opportunities.
      </PageHeading>
      <div className="hero-grid">
        <Card className="xp-card">
          <p className="eyebrow">CURRENT PROGRESS</p>
          <div className="xp-value">{xp} <span>XP</span></div>
          <p>Level {level} · {next ? `${next - xp} XP to the next level` : 'Maximum level reached'}</p>
          <div className="progress"><span style={{ width: `${Math.round(progress * 100)}%` }} /></div>
        </Card>
        <Card>
          <p className="eyebrow">EQUIPPED OUTFIT</p>
          <h2>{outfit}</h2>
          <Link className="button secondary" href="/avatar">Customise avatar</Link>
        </Card>
      </div>
      <PageHeading eyebrow="FEATURED ACTIVITIES" title="Build your momentum" />
      <div className="activity-grid">
        <Card>
          <h2>Complete Employer Assessment</h2>
          <p>Show your skills and receive employer approval.</p>
          <button disabled={assessmentDone} onClick={() => complete('assessment')}>
            {assessmentDone ? 'Completed' : 'Complete activity (+300 XP)'}
          </button>
        </Card>
        <Card>
          <h2>Attend Career Workshop</h2>
          <p>Join a workshop after completing the assessment.</p>
          <button disabled={!assessmentDone || workshopDone} onClick={() => complete('workshop')}>
            {workshopDone ? 'Completed' : assessmentDone ? 'Complete activity (+200 XP)' : 'Complete the assessment first'}
          </button>
        </Card>
      </div>
    </>
  );
}

function Activities() {
  const { drafts, addDraft, resetVersion } = useDemo();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    if (!cleanTitle || !cleanDescription) return;
    addDraft({
      external_id: `demo-${Date.now()}`,
      title: cleanTitle,
      description: cleanDescription,
      category: 'General',
      final_xp: null,
      status: 'Draft',
      factors: {
        difficulty: 'MODERATE',
        estimated_time_value: 2,
        estimated_time_unit: 'HOURS',
        skill_level: 'BEGINNER',
        effort: 'MODERATE',
        complexity: 'MULTIPLE_STEPS',
        student_impact: 'HIGH',
        verification_method: 'EDUCATOR_APPROVAL',
        repeatability: 'ONE_TIME',
        completion_type: 'COMPLETION',
      },
    });
    setTitle('');
    setDescription('');
    setShowModal(false);
  }

  return (
    <>
      <PageHeading eyebrow="ACTIVITY MANAGEMENT" title="Activities">
        Draft and review learning activities for the campus.
      </PageHeading>
      <Card className="toolbar">
        <div><strong>{drafts.length} draft{drafts.length === 1 ? '' : 's'}</strong><p className="muted">Create a demo activity locally.</p></div>
        <button onClick={() => setShowModal(true)}>Create activity</button>
      </Card>
      {drafts.length === 0 ? <Card><p className="muted">No drafts yet. Create your first activity to get started.</p></Card> : (
        <div className="activity-grid">
          {drafts.map(draft => <Card key={`${resetVersion}-${draft.external_id}`}><p className="eyebrow">{draft.status}</p><h2>{draft.title}</h2><p>{draft.description}</p></Card>)}
        </div>
      )}
      {showModal && <Modal title="Create an activity" onClose={() => setShowModal(false)}>
        <form className="form" onSubmit={submit}>
          <label>Title<input value={title} onChange={event => setTitle(event.target.value)} required /></label>
          <label>Description<textarea value={description} onChange={event => setDescription(event.target.value)} required /></label>
          <button type="submit">Save draft</button>
        </form>
      </Modal>}
    </>
  );
}

function Avatar() {
  const { completed, outfit, equip } = useDemo();
  const outfits = ['Campus Hoodie', 'Career Blazer', 'Gold Jacket'];
  return (
    <>
      <PageHeading eyebrow="CAMPUS HUB" title="Your avatar">
        Equip rewards earned through your progress.
      </PageHeading>
      <Card className="avatar-card">
        <div className="avatar-mark" aria-hidden="true">A</div>
        <h2>{outfit}</h2>
        <div className="outfit-list">
          {outfits.map(name => {
            const unlocked = name === 'Campus Hoodie' || (name === 'Career Blazer' && completed.includes('assessment')) || (name === 'Gold Jacket' && completed.length > 1);
            return <button className="secondary" disabled={!unlocked} key={name} onClick={() => equip(name)}>{name}{!unlocked && ' (locked)'}</button>;
          })}
        </div>
      </Card>
    </>
  );
}

function AppRoutes() {
  const location = useLocation();
  const page = location.split('?')[0];
  if (page === '/activities') return <Activities />;
  if (page === '/avatar') return <Avatar />;
  return <Dashboard />;
}

export function App() {
  return <DemoProvider><Layout><AppRoutes /></Layout></DemoProvider>;
}
