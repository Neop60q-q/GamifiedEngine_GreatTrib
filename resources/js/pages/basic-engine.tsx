import { Head, Link } from '@inertiajs/react';
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

export default function BasicEngine({
    definitions,
    levels,
}: {
    definitions: Definition[];
    levels: Level[];
}) {
    const [xp, setXp] = useState(0);
    const [activityLog, setActivityLog] = useState<Definition[]>([]);

    const currentLevel = useMemo(
        () =>
            [...levels].reverse().find((level) => xp >= level.xp_threshold) ??
            levels[0],
        [levels, xp],
    );
    const nextLevel = levels.find(
        (level) => level.level > (currentLevel?.level ?? 1),
    );
    const progress = nextLevel
        ? Math.round(
              ((xp - (currentLevel?.xp_threshold ?? 0)) /
                  (nextLevel.xp_threshold -
                      (currentLevel?.xp_threshold ?? 0))) *
                  100,
          )
        : 100;

    const complete = (definition: Definition) => {
        setXp((currentXp) => currentXp + definition.xp_value);
        setActivityLog((items) => [definition, ...items]);
    };

    const reset = () => {
        setXp(0);
        setActivityLog([]);
    };

    return (
        <>
            <Head title="XP Engine Demo" />
            <main className="min-h-screen bg-gray-100 px-4 py-8 text-gray-900">
                <div className="mx-auto max-w-5xl">
                    <header className="mb-6 rounded border border-gray-300 bg-white p-6">
                        <p className="mb-2 text-sm font-bold text-green-700">
                            ENGINE STATUS: ONLINE
                        </p>
                        <h1 className="text-3xl font-bold">
                            Alumable XP Engine Demo
                        </h1>
                        <p className="mt-3 max-w-3xl text-gray-600">
                            This basic screen demonstrates how a student earns
                            XP, progresses through levels, and unlocks platform
                            capabilities. Educator and employer portals will
                            eventually send these completion events through the
                            engine API.
                        </p>
                    </header>

                    <section className="mb-6 grid gap-4 sm:grid-cols-2">
                        <InfoBox
                            title="Student portal"
                            text="Shows XP, level, progress and unlocked opportunities."
                            href="/student"
                        />
                        <InfoBox
                            title="Educator and employer portal"
                            text="A shared management portal with separate educator and employer identities."
                            href="/management"
                        />
                    </section>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <section className="rounded border border-gray-300 bg-white p-6">
                            <div className="mb-5 flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold">
                                        Example student progress
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Demo Student · student-demo-001
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={reset}
                                    className="rounded border border-gray-400 px-3 py-2 text-sm hover:bg-gray-100"
                                >
                                    Reset demo
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <StatBox
                                    label="Total XP"
                                    value={xp.toLocaleString()}
                                />
                                <StatBox
                                    label="Current level"
                                    value={String(currentLevel?.level ?? 1)}
                                />
                            </div>

                            <div className="mt-5">
                                <div className="mb-2 flex justify-between text-sm">
                                    <span>Progress to next level</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="h-5 overflow-hidden rounded border border-gray-400 bg-gray-200">
                                    <div
                                        className="h-full bg-green-600 transition-all"
                                        style={{
                                            width: `${Math.min(progress, 100)}%`,
                                        }}
                                    />
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    {nextLevel
                                        ? `${nextLevel.xp_threshold - xp} XP remaining until Level ${nextLevel.level}`
                                        : 'Maximum configured level reached'}
                                </p>
                            </div>

                            <div className="mt-5 rounded border border-green-300 bg-green-50 p-4">
                                <p className="text-sm font-bold">
                                    Current capability
                                </p>
                                <p>
                                    {currentLevel?.capability ??
                                        'Student Profile'}
                                </p>
                            </div>
                        </section>

                        <section className="rounded border border-gray-300 bg-white p-6">
                            <h2 className="text-xl font-bold">
                                Complete an activity
                            </h2>
                            <p className="mb-4 text-sm text-gray-500">
                                Click a box to simulate an approved completion.
                            </p>
                            <div className="space-y-3">
                                {definitions.map((definition) => (
                                    <button
                                        key={definition.id}
                                        type="button"
                                        onClick={() => complete(definition)}
                                        className="flex w-full items-center justify-between rounded border border-gray-300 p-4 text-left hover:border-green-600 hover:bg-green-50"
                                    >
                                        <span>
                                            <span className="block font-bold">
                                                {definition.title}
                                            </span>
                                            <span className="block text-sm text-gray-500 capitalize">
                                                {definition.type} ·{' '}
                                                {definition.verification}{' '}
                                                verification ·{' '}
                                                {definition.repeatability}
                                            </span>
                                        </span>
                                        <span className="ml-4 font-bold whitespace-nowrap text-green-700">
                                            +{definition.xp_value} XP
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>

                    <section className="mt-6 rounded border border-gray-300 bg-white p-6">
                        <h2 className="mb-4 text-xl font-bold">
                            Level and capability rules
                        </h2>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                            {levels.map((level) => {
                                const unlocked = xp >= level.xp_threshold;
                                return (
                                    <div
                                        key={level.id}
                                        className={`rounded border p-4 ${
                                            unlocked
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-300 bg-gray-50'
                                        }`}
                                    >
                                        <p className="font-bold">
                                            Level {level.level}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {level.xp_threshold.toLocaleString()}{' '}
                                            XP
                                        </p>
                                        <p className="mt-3 text-sm">
                                            {level.capability}
                                        </p>
                                        <p className="mt-2 text-xs font-bold">
                                            {unlocked ? 'UNLOCKED' : 'LOCKED'}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className="mt-6 rounded border border-gray-300 bg-white p-6">
                        <h2 className="text-xl font-bold">Demo activity log</h2>
                        <p className="mb-4 text-sm text-gray-500">
                            The production engine stores equivalent events in
                            its audited transaction ledger.
                        </p>
                        {activityLog.length === 0 ? (
                            <p className="rounded border border-dashed border-gray-300 p-4 text-gray-500">
                                No activities completed yet.
                            </p>
                        ) : (
                            <div className="divide-y divide-gray-200 border-y border-gray-200">
                                {activityLog.map((item, index) => (
                                    <div
                                        key={`${item.id}-${index}`}
                                        className="flex justify-between py-3 text-sm"
                                    >
                                        <span>{item.title}</span>
                                        <span className="font-bold text-green-700">
                                            +{item.xp_value} XP
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <footer className="py-6 text-center text-sm text-gray-500">
                        Demonstration only — the buttons on this page do not
                        write to the production XP ledger.
                    </footer>
                </div>
            </main>
        </>
    );
}

function InfoBox({
    title,
    text,
    href,
}: {
    title: string;
    text: string;
    href: string;
}) {
    return (
        <div className="rounded border border-gray-300 bg-white p-5">
            <h2 className="font-bold">{title}</h2>
            <p className="mt-2 text-sm text-gray-600">{text}</p>
            <Link
                href={href}
                className="mt-4 inline-block rounded border border-gray-400 px-3 py-2 text-sm font-bold hover:bg-gray-100"
            >
                Open portal →
            </Link>
        </div>
    );
}

function StatBox({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded border border-gray-300 bg-gray-50 p-4">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-1 text-3xl font-bold">{value}</p>
        </div>
    );
}
