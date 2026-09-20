import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Card, Modal, PageHeading } from '../shared/components';
import { DemoProvider, useDemo } from '../shared/DemoProvider';
import { Link, useLocation } from '../shared/navigation';
import { createActivity, listActivities, type PersistedActivity } from '../features/activity-creation/api';

const navItems = [
  ['/', 'Dashboard'],
  ['/activities', 'Library'],
  ['/challenges', 'Assignments'],
  ['/achievements', 'Review queue'],
];

function Layout({ children }: { children: ReactNode }) {
  const { reset } = useDemo();
  const location = useLocation().split('?')[0];
  return <div className="app-shell">
    <aside className="sidebar">
      <Link className="brand" href="/"><span className="brand-mark">A</span><span>Alumable</span></Link>
      <p className="nav-label">MAIN MENU</p>
      <nav aria-label="Primary navigation">
        {navItems.map(([href, label]) => <Link className={location === href ? 'active' : ''} href={href} key={href}><span className="nav-icon">{label?.slice(0, 1)}</span>{label}</Link>)}
      </nav>
      <div className="sidebar-footer"><p className="nav-label">ACCOUNT</p><button className="sidebar-link" onClick={reset}><span className="nav-icon">↻</span>Reset demo</button></div>
    </aside>
    <div className="app-main">
      <header className="topbar"><div><span className="breadcrumb">Alumable / </span><strong>{navItems.find(([href]) => href === location)?.[1] ?? 'Dashboard'}</strong></div><div className="user-menu"><span className="notification">●</span><span className="avatar-small">JD</span><span>Jordan Davis</span><span className="chevron">⌄</span></div></header>
      <main className="content">{children}</main>
    </div>
  </div>;
}

function StatCard({ label, value, detail, tone = '' }: { label: string; value: string; detail: string; tone?: string }) {
  return <Card className={`stat-card ${tone}`}><div className="stat-top"><span>{label}</span><span className="stat-icon">↗</span></div><strong>{value}</strong><p>{detail || label}</p></Card>;
}

function Dashboard() {
  const approvals = [
    ['JB', 'Jack Brown', 'Attend Career Workshop', '2h ago', 'lilac'],
    ['ML', 'Marcus Lee', 'Complete Employer Assessment', '5h ago', 'blue'],
    ['PS', 'Priya Sharma', 'Upload Resume Draft', '1d ago', 'mint'],
  ];
  return <div className="client-dashboard">
    <PageHeading eyebrow="" title="Good morning, Northline Studio" />
    <div className="stat-grid client-stats">
      <StatCard label="Active activities" value="6" detail="" />
      <StatCard label="Active challenges" value="2" detail="" />
      <StatCard label="Students assigned" value="34" detail="" />
      <StatCard label="Pending approvals" value="5" detail="" tone="amber" />
    </div>
    <section className="client-section"><h2>Activities &amp; challenges</h2><div className="client-table"><div className="client-table-head"><span>Activity / Challenge</span><span>Status</span><span>Assigned</span></div>
      {[['Attend Career Workshop', 'Active', '12'], ['Portfolio Sprint Challenge', 'Draft', '—'], ['Complete Employer Assessment', 'Active', '22']].map(row => <div className="client-table-row" key={row[0]}><strong>{row[0]}</strong><span className={`client-pill ${row[1].toLowerCase()}`}>{row[1]}</span><span>{row[2]}</span></div>)}
    </div></section>
    <section className="client-section approvals"><h2>Pending approvals</h2><div className="approval-list">{approvals.map(row => <div className="approval-row" key={row[1]}><span className={`approval-avatar ${row[4]}`}>{row[0]}</span><div className="approval-person"><strong>{row[1]}</strong><span>{row[2]}</span></div><span className="client-pill review">Pending review</span><span className="approval-time">{row[3]}</span><button className="review-button">Review</button></div>)}</div></section>
  </div>;
}

function Activities() {
  const [showModal, setShowModal] = useState(false);
  const [activities, setActivities] = useState<PersistedActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    listActivities()
      .then(setActivities)
      .catch(value => setError(value instanceof Error ? value.message : 'Could not load activities'))
      .finally(() => setLoading(false));
  }, []);
  const templates = [
    ['CHALLENGE · PHASE ONE', 'Attend Career Workshop', 'Attend and participate in an employer-hosted careers session.', 'Moderate · 2 hrs', '~120 XP'],
    ['ACTIVITY · PHASE ONE', 'Upload Resume Draft', 'Submit a resume for automatic profile completion credit.', 'Easy · 30 min', '~45 XP'],
    ['CHALLENGE', 'Portfolio Sprint Challenge', 'Five activities culminating in employer portfolio review.', 'Hard · one week · five activities', '~275 XP'],
    ['ACTIVITY · PHASE ONE', 'Complete Employer Assessment', 'Scenario-based task reviewed and approved by your team.', 'Difficult · 3 hrs', '~250 XP'],
    ['ACTIVITY · PHASE ONE', 'Daily Login Streak', 'Automatic credit for returning to the platform daily.', 'Very Easy · 10 min', '~5 XP'],
  ];
  return <div className="library-page"><PageHeading eyebrow="" title="Activities &amp; Challenges Library" actions={<button className="template-button" onClick={() => setShowModal(true)}><span>add</span> New from template</button>}>Choose from Alumable’s approved Phase-One templates — XP is set by the Gamification Engine once you configure requirements.</PageHeading><div className="library-toolbar"><div className="library-tabs"><button className="selected">All</button><button>Activities</button><button>Challenges</button></div><div className="library-search"><span>search</span><input placeholder="Search templates" /></div></div>{loading && <p className="muted">Loading saved activities...</p>}{error && <p role="alert">{error}</p>}<div className="template-grid">{activities.map(activity => <Card className="template-card" key={activity.external_id}><p className="template-type">ACTIVITY · SAVED</p><h2>{activity.title}</h2><p className="template-description">{activity.description}</p><div className="template-meta"><span>{activity.category} · {activity.status}</span><strong>{activity.final_xp} XP</strong></div></Card>)}{templates.map(template => <Card className="template-card" key={template[1]}><p className="template-type">{template[0]}</p><h2>{template[1]}</h2><p className="template-description">{template[2]}</p><div className="template-meta"><span>{template[3]}</span><strong>{template[4]}</strong></div></Card>)}<div className="coming-card">More templates coming soon</div></div>{showModal && <CreateModal onCreated={activity => setActivities(previous => [activity, ...previous])} onClose={() => setShowModal(false)} />}</div>;
}

function CreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: (activity: PersistedActivity) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Employment');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    createActivity({ title: title.trim(), description: description.trim(), category })
      .then(activity => { onCreated(activity); onClose(); })
      .catch(value => setError(value instanceof Error ? value.message : 'Could not save activity'))
      .finally(() => setSaving(false));
  }
  return <Modal title="Create activity" onClose={onClose}><form className="form" onSubmit={submit}><label>Activity name<input value={title} onChange={event => setTitle(event.target.value)} placeholder="e.g. Complete Employer Assessment" required /></label><label>Description<textarea value={description} onChange={event => setDescription(event.target.value)} placeholder="Describe the activity..." required /></label><label>Category<select value={category} onChange={event => setCategory(event.target.value)}><option>Employment</option><option>Career Development</option><option>Skills</option></select></label>{error && <p role="alert">{error}</p>}<div className="modal-actions"><button className="secondary" type="button" onClick={onClose} disabled={saving}>Cancel</button><button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save draft'}</button></div></form></Modal>;
}

function ManagementPage({ title, eyebrow, description, children, action }: { title: string; eyebrow: string; description: string; children: ReactNode; action: string }) {
  return <><PageHeading eyebrow={eyebrow} title={title} actions={<button>{action}</button>}>{description}</PageHeading><Card>{children}</Card></>;
}

function Challenges() {
  return <ManagementPage eyebrow="CHALLENGE MANAGEMENT" title="Challenges" description="Group activities together and reward students for reaching milestones." action="+ Create challenge"><div className="empty-table"><div className="empty-icon">✦</div><h2>No challenges created yet</h2><p className="muted">Create a challenge to motivate students with a larger goal.</p><button>+ Create your first challenge</button></div></ManagementPage>;
}
function Achievements() {
  return <ManagementPage eyebrow="ACHIEVEMENT MANAGEMENT" title="Achievements" description="Define rewards students can unlock as they progress." action="+ Create achievement"><div className="achievement-list">{['Career Starter', 'Portfolio Builder', 'Community Contributor'].map((name, index) => <div className="achievement-row" key={name}><div className="achievement-badge">{index === 0 ? '★' : '✦'}</div><div><strong>{name}</strong><p className="muted">Awarded when a student completes {index + 1} qualifying activities</p></div><span className="status active">Active</span><strong>+{50 + index * 25} XP</strong></div>)}</div></ManagementPage>;
}
function XpRules() {
  return <ManagementPage eyebrow="ENGINE CONFIGURATION" title="XP rules" description="Configure how activities are scored and how much XP students earn." action="+ Add rule"><div className="rule-grid">{['Difficulty multiplier', 'Estimated time', 'Skill level', 'Student impact'].map((rule, index) => <div className="rule-card" key={rule}><div className="rule-dot">✦</div><div><strong>{rule}</strong><p className="muted">Controls the XP weighting for this factor</p></div><span>{index + 1}.0×</span><button className="icon-button">•••</button></div>)}</div></ManagementPage>;
}
function Detail() {
  return <><PageHeading eyebrow="ACTIVITY CREATION" title="Create an activity" actions={<><button className="secondary">Cancel</button><button>Save activity</button></>}>Set the details and factors used to calculate XP.</PageHeading><div className="detail-grid"><Card><h2>Activity details</h2><form className="form"><label>Activity name<input placeholder="Enter activity name" /></label><label>Description<textarea placeholder="Describe the activity..." /></label><div className="two-col"><label>Category<select><option>Employment</option></select></label><label>Status<select><option>Draft</option><option>Active</option></select></label></div></form><h2 className="section-title">XP factors</h2><div className="two-col">{['Difficulty', 'Estimated time', 'Skill level', 'Effort', 'Complexity', 'Student impact'].map(label => <label className="form-label" key={label}>{label}<select><option>Moderate</option><option>High</option><option>Low</option></select></label>)}</div></Card><Card className="summary-card"><p className="eyebrow">XP PREVIEW</p><div className="preview-xp">275 <span>XP</span></div><p className="muted">Estimated reward based on selected factors.</p><div className="summary-divider" /><p className="eyebrow">ACTIVITY STATUS</p><span className="status draft">Draft</span></Card></div></>;
}

function AppRoutes() {
  const page = useLocation().split('?')[0];
  if (page === '/activities') return <Activities />;
  if (page === '/challenges') return <Challenges />;
  if (page === '/achievements') return <Achievements />;
  if (page === '/xp-rules') return <XpRules />;
  if (page === '/activities/new') return <Detail />;
  return <Dashboard />;
}
export function App() { return <DemoProvider><Layout><AppRoutes /></Layout></DemoProvider>; }
