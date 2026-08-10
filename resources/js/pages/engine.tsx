import { Head } from '@inertiajs/react';
import {
    Award,
    BookOpenCheck,
    Building2,
    ChevronRight,
    GraduationCap,
    RotateCcw,
    ShieldCheck,
    Sparkles,
    UserRound,
    Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';

type Definition = {
    id: number;
    code: string;
    type: 'activity' | 'challenge' | 'achievement';
    title: string;
    xp_value: number;
    verification: string;
    repeatability: string;
};

type Level = {
    id: number;
    level: number;
    xp_threshold: number;
    capability: string;
};

export default function Engine({
    definitions,
    levels,
}: {
    definitions: Definition[];
    levels: Level[];
}) {
    const [demoXp, setDemoXp] = useState(0);
    const [recentAwards, setRecentAwards] = useState<Definition[]>([]);

    const currentLevel = useMemo(
        () =>
            [...levels]
                .reverse()
                .find((level) => demoXp >= level.xp_threshold) ?? levels[0],
        [demoXp, levels],
    );
    const nextLevel = levels.find(
        (level) => level.level > (currentLevel?.level ?? 1),
    );
    const progress = nextLevel
        ? Math.min(
              100,
              ((demoXp - (currentLevel?.xp_threshold ?? 0)) /
                  (nextLevel.xp_threshold -
                      (currentLevel?.xp_threshold ?? 0))) *
                  100,
          )
        : 100;

    const awardXp = (definition: Definition) => {
        setDemoXp((value) => value + definition.xp_value);
        setRecentAwards((items) => [definition, ...items].slice(0, 4));
    };

    return (
        <>
            <Head title="XP Engine" />
            <div className="min-h-screen bg-[#07120f] text-white selection:bg-emerald-300 selection:text-emerald-950">
                <div className="pointer-events-none fixed inset-0 overflow-hidden">
                    <div className="absolute -top-48 left-1/3 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
                    <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-cyan-400/8 blur-3xl" />
                </div>

                <header className="relative border-b border-white/10">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-300 text-emerald-950 shadow-lg shadow-emerald-500/20">
                                <Zap className="size-5" fill="currentColor" />
                            </div>
                            <div>
                                <p className="font-semibold tracking-tight">Alumable</p>
                                <p className="text-xs text-emerald-200/60">XP Engine · v1</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/8 px-3 py-1.5 text-xs text-emerald-200">
                            <span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_#6ee7b7]" />
                            Engine online
                        </div>
                    </div>
                </header>

                <main className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
                    <section className="mb-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
                        <div>
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                                <Sparkles className="size-3.5 text-amber-300" />
                                Rewarding contribution and achievement
                            </div>
                            <h1 className="max-w-3xl text-4xl leading-[1.05] font-semibold tracking-[-0.04em] sm:text-6xl">
                                One progression engine.
                                <span className="block text-emerald-300">Every student journey.</span>
                            </h1>
                            <p className="mt-6 max-w-2xl text-base leading-7 text-white/55">
                                A shared, auditable XP foundation for the student app,
                                educators and employers. Define meaningful work, award it
                                once, and unlock new opportunities as students progress.
                            </p>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                [UserRound, 'Student', 'Track'],
                                [GraduationCap, 'Educator', 'Approve'],
                                [Building2, 'Employer', 'Reward'],
                            ].map(([Icon, label, action]) => (
                                <div key={label as string} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                                    <Icon className="mb-5 size-5 text-emerald-300" />
                                    <p className="text-sm font-medium">{label as string}</p>
                                    <p className="mt-1 text-xs text-white/35">{action as string}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]">
                            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                                <div>
                                    <p className="font-medium">XP simulator</p>
                                    <p className="mt-1 text-xs text-white/40">Try the seeded phase-one rules locally</p>
                                </div>
                                <button onClick={() => { setDemoXp(0); setRecentAwards([]); }} className="rounded-lg p-2 text-white/40 transition hover:bg-white/5 hover:text-white" title="Reset simulator">
                                    <RotateCcw className="size-4" />
                                </button>
                            </div>

                            <div className="grid gap-8 p-6 md:grid-cols-[0.8fr_1.2fr]">
                                <div className="rounded-2xl bg-emerald-300 p-6 text-emerald-950">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-semibold tracking-widest uppercase opacity-60">Current level</p>
                                            <p className="mt-2 text-5xl font-semibold tracking-tighter">{currentLevel?.level ?? 1}</p>
                                        </div>
                                        <Award className="size-7 opacity-50" />
                                    </div>
                                    <p className="mt-8 text-2xl font-semibold tracking-tight">{demoXp.toLocaleString()} XP</p>
                                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-emerald-950/15">
                                        <div className="h-full rounded-full bg-emerald-950 transition-all duration-500" style={{ width: `${progress}%` }} />
                                    </div>
                                    <p className="mt-3 text-xs font-medium opacity-60">
                                        {nextLevel ? `${nextLevel.xp_threshold - demoXp} XP to Level ${nextLevel.level}` : 'Maximum level reached'}
                                    </p>
                                    <div className="mt-6 border-t border-emerald-950/15 pt-4">
                                        <p className="text-xs opacity-60">Latest unlock</p>
                                        <p className="mt-1 text-sm font-semibold">{currentLevel?.capability ?? 'Student Profile'}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="mb-3 text-xs font-semibold tracking-wider text-white/40 uppercase">Award an action</p>
                                    <div className="space-y-2">
                                        {definitions.slice(0, 5).map((definition) => (
                                            <button key={definition.id} onClick={() => awardXp(definition)} className="group flex w-full items-center justify-between rounded-xl border border-white/8 bg-white/[0.025] px-4 py-3 text-left transition hover:border-emerald-300/30 hover:bg-emerald-300/5">
                                                <span>
                                                    <span className="block text-sm font-medium">{definition.title}</span>
                                                    <span className="mt-0.5 block text-[11px] text-white/35 capitalize">{definition.type} · {definition.verification} verification</span>
                                                </span>
                                                <span className="flex items-center gap-1 text-sm font-semibold text-emerald-300">
                                                    +{definition.xp_value}<ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {recentAwards.length > 0 && (
                                <div className="border-t border-white/10 px-6 py-4">
                                    <div className="flex flex-wrap gap-2">
                                        {recentAwards.map((item, index) => (
                                            <span key={`${item.id}-${index}`} className="rounded-full bg-white/5 px-3 py-1 text-[11px] text-white/50">+{item.xp_value} · {item.title}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Progression path</p>
                                    <p className="mt-1 text-xs text-white/40">Configurable capability thresholds</p>
                                </div>
                                <ShieldCheck className="size-5 text-emerald-300" />
                            </div>
                            <div className="max-h-[460px] space-y-1 overflow-y-auto pr-2">
                                {levels.map((level) => {
                                    const unlocked = demoXp >= level.xp_threshold;
                                    return (
                                        <div key={level.id} className={`flex items-center gap-4 rounded-xl px-3 py-3 transition ${unlocked ? 'bg-emerald-300/8' : ''}`}>
                                            <div className={`flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${unlocked ? 'border-emerald-300 bg-emerald-300 text-emerald-950' : 'border-white/10 text-white/30'}`}>{level.level}</div>
                                            <div className="min-w-0 flex-1">
                                                <p className={`truncate text-sm ${unlocked ? 'text-white' : 'text-white/45'}`}>{level.capability}</p>
                                                <p className="mt-0.5 text-[11px] text-white/30">{level.xp_threshold.toLocaleString()} total XP</p>
                                            </div>
                                            {unlocked && <BookOpenCheck className="size-4 shrink-0 text-emerald-300" />}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
