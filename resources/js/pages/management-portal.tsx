import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Box, PortalPage } from '@/components/portal-page';

type Role = 'educator' | 'employer';
type ItemType = 'activity' | 'challenge';

type Definition = {
    id: number;
    title: string;
    type: string;
    xp_value: number;
    verification: string;
};

type Draft = {
    id: number;
    title: string;
    type: ItemType;
    xp: number;
    role: Role;
    actorId: string;
    verification: string;
};

const templates = [
    { title: 'Attend a career workshop', type: 'activity' as const, xp: 150 },
    { title: 'Complete an employer gig', type: 'challenge' as const, xp: 250 },
];

export default function ManagementPortal({
    definitions,
    initialRole,
}: {
    definitions: Definition[];
    initialRole: Role;
}) {
    const [role, setRole] = useState<Role>(initialRole);
    const [actorId, setActorId] = useState(
        initialRole === 'educator' ? 'educator-demo-001' : 'employer-demo-001',
    );
    const [showModal, setShowModal] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const [title, setTitle] = useState('');
    const [type, setType] = useState<ItemType>(
        initialRole === 'educator' ? 'activity' : 'challenge',
    );
    const [xp, setXp] = useState(100);
    const [verification, setVerification] = useState<Role>(initialRole);
    const [drafts, setDrafts] = useState<Draft[]>([]);

    const changeRole = (nextRole: Role) => {
        setRole(nextRole);
        setActorId(
            nextRole === 'educator' ? 'educator-demo-001' : 'employer-demo-001',
        );
        setType(nextRole === 'educator' ? 'activity' : 'challenge');
        setVerification(nextRole);
    };

    const openCreate = () => {
        setTitle('');
        setXp(100);
        setShowTemplates(false);
        setShowModal(true);
    };

    const useTemplate = (template: (typeof templates)[number]) => {
        setTitle(template.title);
        setType(template.type);
        setXp(template.xp);
        setShowTemplates(false);
    };

    const saveDraft = () => {
        if (!title.trim() || !actorId.trim() || xp < 1) return;

        setDrafts((items) => [
            {
                id: Date.now(),
                title: title.trim(),
                type,
                xp,
                role,
                actorId: actorId.trim(),
                verification,
            },
            ...items,
        ]);
        setShowModal(false);
    };

    return (
        <>
            <Head title="Management Portal Prototype" />
            <PortalPage
                label="EDUCATOR AND EMPLOYER PORTAL"
                title="Activity and challenge management"
                description="Educators and employers share the same interface, while the engine keeps their role and external actor identifier separate for permissions and auditing."
            >
                <section className="mb-4 rounded border border-gray-300 bg-white p-5">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <p className="mb-2 text-sm font-bold">
                                View portal as
                            </p>
                            <div className="flex gap-2">
                                {(['educator', 'employer'] as Role[]).map(
                                    (item) => (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => changeRole(item)}
                                            className={`rounded border px-4 py-2 text-sm font-bold capitalize ${
                                                role === item
                                                    ? 'border-blue-700 bg-blue-700 text-white'
                                                    : 'border-gray-400 bg-white'
                                            }`}
                                        >
                                            {item}
                                        </button>
                                    ),
                                )}
                            </div>
                        </div>
                        <div className="min-w-64">
                            <label
                                className="mb-2 block text-sm font-bold"
                                htmlFor="actor-id"
                            >
                                External {role} identifier
                            </label>
                            <input
                                id="actor-id"
                                value={actorId}
                                onChange={(event) =>
                                    setActorId(event.target.value)
                                }
                                className="w-full rounded border border-gray-400 px-3 py-2"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={openCreate}
                            className="rounded bg-green-700 px-4 py-3 font-bold text-white hover:bg-green-800"
                        >
                            Create new challenge/activity
                        </button>
                    </div>
                </section>

                <div className="grid gap-4 md:grid-cols-3">
                    <Box title="Current role">
                        <p className="text-3xl font-bold capitalize">{role}</p>
                        <p className="mt-2 text-sm break-all text-gray-500">
                            {actorId}
                        </p>
                    </Box>
                    <Box title="Configured engine rules">
                        <p className="text-4xl font-bold">
                            {definitions.length}
                        </p>
                    </Box>
                    <Box title="Drafts this session">
                        <p className="text-4xl font-bold">{drafts.length}</p>
                    </Box>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <Box title="Existing fixed phase-one rules">
                        <div className="space-y-2">
                            {definitions.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded border border-gray-300 p-3"
                                >
                                    <div className="flex justify-between gap-3">
                                        <p className="font-bold">
                                            {item.title}
                                        </p>
                                        <p className="font-bold text-green-700">
                                            {item.xp_value} XP
                                        </p>
                                    </div>
                                    <p className="text-sm text-gray-500 capitalize">
                                        {item.type} - {item.verification}{' '}
                                        verification
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Box>
                    <Box title="New draft items">
                        {drafts.length === 0 ? (
                            <p className="rounded border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                                No drafts yet. Use the create button above.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {drafts.map((draft) => (
                                    <div
                                        key={draft.id}
                                        className="rounded border border-blue-300 bg-blue-50 p-3"
                                    >
                                        <div className="flex justify-between gap-3">
                                            <p className="font-bold">
                                                {draft.title}
                                            </p>
                                            <p className="font-bold">
                                                {draft.xp} XP
                                            </p>
                                        </div>
                                        <p className="mt-1 text-sm capitalize">
                                            {draft.type} created by {draft.role}
                                        </p>
                                        <p className="text-xs break-all text-gray-500">
                                            Actor: {draft.actorId}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Box>
                </div>

                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                        <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded border border-gray-400 bg-white p-6 shadow-xl">
                            <div className="mb-5 flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold">
                                        Create new challenge/activity
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500 capitalize">
                                        Creating as {role}: {actorId}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="text-2xl leading-none"
                                    aria-label="Close"
                                >
                                    ×
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowTemplates((value) => !value)
                                }
                                className="mb-4 rounded border border-blue-600 px-3 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50"
                            >
                                Use templates
                            </button>

                            {showTemplates && (
                                <div className="mb-4 space-y-2 rounded border border-blue-200 bg-blue-50 p-3">
                                    {templates.map((template) => (
                                        <button
                                            key={template.title}
                                            type="button"
                                            onClick={() =>
                                                useTemplate(template)
                                            }
                                            className="block w-full rounded border border-gray-300 bg-white p-3 text-left hover:border-blue-600"
                                        >
                                            <span className="font-bold">
                                                {template.title}
                                            </span>
                                            <span className="block text-sm text-gray-500 capitalize">
                                                {template.type} - {template.xp}{' '}
                                                XP
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="space-y-4">
                                <Field label="Title">
                                    <input
                                        value={title}
                                        onChange={(event) =>
                                            setTitle(event.target.value)
                                        }
                                        className="w-full rounded border border-gray-400 px-3 py-2"
                                        placeholder="Enter a title"
                                    />
                                </Field>
                                <Field label="Type">
                                    <select
                                        value={type}
                                        onChange={(event) =>
                                            setType(
                                                event.target.value as ItemType,
                                            )
                                        }
                                        className="w-full rounded border border-gray-400 px-3 py-2"
                                    >
                                        <option value="activity">
                                            Activity
                                        </option>
                                        <option value="challenge">
                                            Challenge
                                        </option>
                                    </select>
                                </Field>
                                <Field label="XP value">
                                    <input
                                        type="number"
                                        min="1"
                                        value={xp}
                                        onChange={(event) =>
                                            setXp(Number(event.target.value))
                                        }
                                        className="w-full rounded border border-gray-400 px-3 py-2"
                                    />
                                </Field>
                                <Field label="Verification">
                                    <select
                                        value={verification}
                                        onChange={(event) =>
                                            setVerification(
                                                event.target.value as Role,
                                            )
                                        }
                                        className="w-full rounded border border-gray-400 px-3 py-2"
                                    >
                                        <option value="educator">
                                            Educator approval
                                        </option>
                                        <option value="employer">
                                            Employer approval
                                        </option>
                                    </select>
                                </Field>
                            </div>

                            <p className="mt-4 rounded bg-yellow-50 p-3 text-sm text-yellow-900">
                                Prototype: saving creates a browser-only draft.
                                Production creation will require authentication,
                                validation and an approval policy.
                            </p>
                            <div className="mt-5 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="rounded border border-gray-400 px-4 py-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={saveDraft}
                                    disabled={
                                        !title.trim() ||
                                        !actorId.trim() ||
                                        xp < 1
                                    }
                                    className="rounded bg-green-700 px-4 py-2 font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
                                >
                                    Save draft
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </PortalPage>
        </>
    );
}

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <label className="block">
            <span className="mb-1 block text-sm font-bold">{label}</span>
            {children}
        </label>
    );
}
