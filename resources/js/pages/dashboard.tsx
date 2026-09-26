import { Head } from '@inertiajs/react';
import { useState } from 'react';

const navigation = ['Dashboard', 'Library', 'Assignments', 'Review queue'];

const activities = [
    { name: 'Attend Career Workshop', status: 'Active', assigned: '12' },
    { name: 'Portfolio Sprint Challenge', status: 'Draft', assigned: '—' },
    { name: 'Employer Assessment', status: 'Active', assigned: '22' },
];

const approvals = [
    { name: 'Jack Brown', color: 'bg-[#efe0fb]' },
    { name: 'Marcus Lee', color: 'bg-[#fce3c8]' },
    { name: 'Priya Sharma', color: 'bg-[#cdf0e7]' },
];

function Logo() {
    return (
        <div className="flex items-center gap-[9px] px-5 pb-5">
            <span className="size-[26px] shrink-0 rounded-[9px] bg-gradient-to-br from-[#9b5fd6] to-[#e4699f]" />
            <span className="font-sans text-[14px] font-extrabold text-[#8557c9]">
                Alumable
            </span>
        </div>
    );
}

function Sidebar({
    active,
    onChange,
}: {
    active: string;
    onChange: (item: string) => void;
}) {
    return (
        <aside className="hidden w-[190px] shrink-0 border-r border-[#eee7f5] bg-white py-[22px] md:block">
            <Logo />
            <nav className="flex flex-col gap-1 px-[10px]" aria-label="Main navigation">
                {navigation.map((item) => {
                    const isActive = item === active;

                    return (
                        <button
                            key={item}
                            type="button"
                            onClick={() => onChange(item)}
                            className={`w-full rounded-xl px-5 py-[10px] text-left text-[13px] transition-colors ${
                                isActive
                                    ? 'bg-[#efe0fb] font-bold text-[#6b3fa0]'
                                    : 'font-normal text-[#6e6a72] hover:bg-[#faf8fb]'
                            }`}
                        >
                            {item}
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}

function StatCard({
    value,
    label,
    accent = false,
}: {
    value: string;
    label: string;
    accent?: boolean;
}) {
    return (
        <div
            className={`rounded-2xl p-[15px] ${accent ? 'bg-[#fbdfe9] text-[#8e4c6e]' : 'bg-white text-[#121212]'}`}
        >
            <p className="text-[24px] leading-7 font-bold">{value}</p>
            <p
                className={`mt-1 text-[11.5px] leading-4 ${accent ? 'font-bold' : 'text-[#6e6a72]'}`}
            >
                {label}
            </p>
        </div>
    );
}

export default function Dashboard() {
    const [activeNavigation, setActiveNavigation] = useState('Dashboard');
    const [reviewed, setReviewed] = useState<string[]>([]);

    const reviewApproval = (name: string) => {
        setReviewed((current) =>
            current.includes(name) ? current : [...current, name],
        );
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="min-h-screen bg-white p-1 font-sans text-[#121212]">
                <div className="flex min-h-[calc(100vh-8px)] overflow-hidden rounded-[20px] border border-black/[0.08] bg-[#faf8fb] shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]">
                    <Sidebar
                        active={activeNavigation}
                        onChange={setActiveNavigation}
                    />

                    <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-7">
                        <div className="mx-auto w-full max-w-[900px]">
                            <div className="mb-[18px] border-b border-transparent pb-px">
                                <h1 className="text-[22px] leading-7 font-bold tracking-[-0.4px]">
                                    Good morning, Northline Studio
                                </h1>
                            </div>

                            <section
                                className="grid grid-cols-2 gap-[10px] sm:grid-cols-4 sm:gap-[14px]"
                                aria-label="Overview"
                            >
                                <StatCard value="6" label="Active activities" />
                                <StatCard value="2" label="Active challenges" />
                                <StatCard value="34" label="Students assigned" />
                                <StatCard
                                    value="5"
                                    label="Pending approvals"
                                    accent
                                />
                            </section>

                            <section className="mt-[18px]">
                                <h2 className="mb-3 text-[14px] leading-5 font-bold">
                                    Activities &amp; challenges
                                </h2>
                                <div className="overflow-hidden rounded-2xl bg-white">
                                    <div className="grid grid-cols-[minmax(0,1fr)_90px_80px] border-b border-[#f0ecf5] px-4 pt-[10px] pb-[11px] text-[10.5px] leading-4 text-[#8a858f]">
                                        <span>Activity / Challenge</span>
                                        <span>Status</span>
                                        <span>Assigned</span>
                                    </div>
                                    {activities.map((activity, index) => (
                                        <div
                                            key={activity.name}
                                            className={`grid grid-cols-[minmax(0,1fr)_90px_80px] items-center px-4 py-3 ${index < activities.length - 1 ? 'border-b border-[#f5f2f8]' : ''}`}
                                        >
                                            <span className="truncate pr-3 text-[12.5px] leading-4 font-bold">
                                                {activity.name}
                                            </span>
                                            <span
                                                className={`text-[11px] leading-4 font-bold ${activity.status === 'Active' ? 'text-[#2e9078]' : 'text-[#8a858f]'}`}
                                            >
                                                {activity.status}
                                            </span>
                                            <span className="text-[11.5px] leading-4 text-[#6e6a72]">
                                                {activity.assigned}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="mt-[46px]">
                                <h2 className="mb-3 text-[14px] leading-5 font-bold">
                                    Pending approvals
                                </h2>
                                <div className="overflow-hidden rounded-2xl bg-white py-2">
                                    {approvals.map((approval, index) => {
                                        const isReviewed = reviewed.includes(
                                            approval.name,
                                        );

                                        return (
                                            <div
                                                key={approval.name}
                                                className={`flex items-center gap-[10px] px-4 py-[10px] ${index < approvals.length - 1 ? 'border-b border-[#f5f2f8]' : ''}`}
                                            >
                                                <span
                                                    className={`size-[26px] shrink-0 rounded-full ${approval.color}`}
                                                />
                                                <span className="min-w-0 flex-1 truncate text-[12px] leading-4 font-bold">
                                                    {approval.name}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        reviewApproval(approval.name)
                                                    }
                                                    className={`h-[26px] shrink-0 rounded-[10px] border border-[#8557c9] px-[11px] text-[11px] leading-4 font-bold text-[#8557c9] transition-colors hover:bg-[#efe0fb] ${isReviewed ? 'bg-[#efe0fb]' : 'bg-white'}`}
                                                >
                                                    {isReviewed ? 'Reviewed' : 'Review'}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
