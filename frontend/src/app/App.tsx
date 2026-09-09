import { useState, type FormEvent, type ReactNode } from 'react';
import { Card, Modal, PageHeading } from '../shared/components';
import { DemoProvider, useDemo } from '../shared/DemoProvider';
import { Link, useLocation } from '../shared/navigation';

const navItems = [
  ['/', 'Dashboard'],
  ['/activities', 'Activities'],
  ['/challenges', 'Challenges'],
  ['/achievements', 'Achievements'],
  ['/xp-rules', 'XP Rules'],
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
  return <Card className={`stat-card ${tone}`}><div className="stat-top"><span>{label}</span><span className="stat-icon">↗</span></div><strong>{value}</strong><p>{detail}</p></Card>;
}

function Dashboard() {
  const { completed, xp, level, progress } = useDemo();
  return <><PageHeading eyebrow="OVERVIEW" title="Good morning, Jordan" actions={<button>+ Create activity</button>}>Here’s what’s happening with your gamification engine today.</PageHeading>
    <div className="stat-grid"><StatCard label="TOTAL ACTIVITIES" value="24" detail="+12.5% from last month" tone="purple" /><StatCard label="ACTIVE CHALLENGES" value="8" detail="+4 new this week" /><StatCard label="ACHIEVEMENTS" value="16" detail="3 unlocked this month" /><StatCard label="TOTAL XP AWARDED" value="12,450" detail="+18.2% from last month" tone="pink" /></div>
    <div className="dashboard-grid"><Card className="wide-card"><div className="card-heading"><div><h2>Recent activities</h2><p className="muted">Latest activities created in your engine</p></div><Link className="text-link" href="/activities">View all →</Link></div><ActivityTable compact /></Card><Card><div className="card-heading"><div><h2>XP overview</h2><p className="muted">Your current progression</p></div></div><div className="level-panel"><div className="level-ring">{level}</div><div><strong>Level {level}</strong><p className="muted">{xp} total XP</p></div></div><div className="progress-label"><span>Progress to next level</span><span>{Math.round(progress * 100)}%</span></div><div className="progress"><span style={{ width: `${Math.round(progress * 100)}%` }} /></div><p className="muted">{completed.length ? `${completed.length} activities completed` : 'Start completing activities to earn XP'}</p></Card></div>
  </>;
}

const activities = [
  ['Complete Employer Assessment', 'Employment', 'Active', '300 XP'],
  ['Attend Career Workshop', 'Career Development', 'Active', '200 XP'],
  ['Build your portfolio', 'Skills', 'Draft', '150 XP'],
  ['Submit your resume', 'Employment', 'Inactive', '100 XP'],
];
function ActivityTable({ compact = false }: { compact?: boolean }) {
  const rows = compact ? activities.slice(0, 3) : activities;
  return <div className="table-wrap"><table><thead><tr><th>ACTIVITY</th><th>CATEGORY</th><th>STATUS</th><th>XP</th><th></th></tr></thead><tbody>{rows.map(row => <tr key={row[0]}><td><strong>{row[0]}</strong><small>ID: ACT-{row[0].length * 17}</small></td><td>{row[1]}</td><td><span className={`status ${row[2].toLowerCase()}`}>{row[2]}</span></td><td>{row[3]}</td><td><button className="icon-button" aria-label={`Open ${row[0]}`}>•••</button></td></tr>)}</tbody></table></div>;
}

function Activities() {
  const [showModal, setShowModal] = useState(false);
  return <><PageHeading eyebrow="ACTIVITY MANAGEMENT" title="Activities" actions={<button onClick={() => setShowModal(true)}>+ Create activity</button>}>Create and manage activities that award XP to students.</PageHeading><Card><div className="filterbar"><div className="search">⌕ <input placeholder="Search activities..." /></div><select defaultValue="all"><option value="all">All categories</option><option>Employment</option><option>Skills</option></select><select defaultValue="all"><option value="all">All status</option><option>Active</option><option>Draft</option></select><button className="secondary">Filter</button></div><ActivityTable /></Card>{showModal && <CreateModal onClose={() => setShowModal(false)} />}</>;
}

function CreateModal({ onClose }: { onClose: () => void }) {
  const { addDraft } = useDemo();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !description.trim()) return;
    addDraft({ external_id: `demo-${Date.now()}`, title: title.trim(), description: description.trim(), category: 'General', final_xp: null, status: 'Draft', factors: { difficulty: 'MODERATE', estimated_time_value: 2, estimated_time_unit: 'HOURS', skill_level: 'BEGINNER', effort: 'MODERATE', complexity: 'MULTIPLE_STEPS', student_impact: 'HIGH', verification_method: 'EDUCATOR_APPROVAL', repeatability: 'ONE_TIME', completion_type: 'COMPLETION' } });
    onClose();
  }
  return <Modal title="Create activity" onClose={onClose}><form className="form" onSubmit={submit}><label>Activity name<input value={title} onChange={event => setTitle(event.target.value)} placeholder="e.g. Complete Employer Assessment" required /></label><label>Description<textarea value={description} onChange={event => setDescription(event.target.value)} placeholder="Describe the activity..." required /></label><label>Category<select defaultValue="Employment"><option>Employment</option><option>Career Development</option><option>Skills</option></select></label><div className="modal-actions"><button className="secondary" type="button" onClick={onClose}>Cancel</button><button type="submit">Save draft</button></div></form></Modal>;
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
