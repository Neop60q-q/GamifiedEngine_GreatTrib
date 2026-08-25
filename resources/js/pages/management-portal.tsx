import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Box, PortalPage } from '@/components/portal-page';
import ManagementLibrary from '@/components/management/management-library';
import type { LibraryItem } from '@/components/management/library-card';
import CreateItemForm, {
    type CreatedItem,
} from '@/components/management/create-item-form';

type Role = 'educator' | 'employer';
type ItemType = 'activity' | 'challenge';

type Definition = {
    id: number;
    title: string;
    description?: string | null;
    type: string;
    xp_value: number;
    verification: string;
    repeatability?: string;
};

type Draft = {
    id: number;
    title: string;
    type: ItemType;
    xp: number;
    role: Role;
    actorId: string;
};
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

    const [drafts, setDrafts] = useState<Draft[]>([]);
    const [createdItems, setCreatedItems] =
    useState<CreatedItem[]>([]);


    const handleCreated = (item: CreatedItem) => {
    setCreatedItems((items) => [item, ...items]);
    setShowModal(false);
    };



    const libraryItems: LibraryItem[] = [
    ...createdItems.map((item) => ({
        id: `created-${item.id}`,
        title: item.title,
        description: item.description,
        type: item.type,
        xp_value: item.xp_value,
        creator_label: item.creator_type,
        status: item.status,
    })),

    ...drafts.map((draft) => ({
        id: `draft-${draft.id}`,
        title: draft.title,
        description: null,
        type: draft.type,
        xp_value: draft.xp,
        creator_label: draft.role,
        status: 'draft',
    })),

    ...definitions
        .filter(
            (definition) =>
                definition.type === 'activity' ||
                definition.type === 'challenge',
        )
        .map((definition) => ({
            id: `definition-${definition.id}`,
            title: definition.title,
            description: null,
            type: definition.type as ItemType,
            xp_value: definition.xp_value,
            creator_label: 'Alumable seed',
            status: 'published',
        })),
    ];

    const changeRole = (nextRole: Role) => {
        setRole(nextRole);
        setActorId(
            nextRole === 'educator'
                ? 'educator-demo-001'
                : 'employer-demo-001',
        );
    };

    const openCreate = () => {
        setShowModal(true);
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

                <ManagementLibrary
                    items={libraryItems}
                    onCreate={openCreate}
                />
                
                {showModal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <CreateItemForm
                            creatorType={role}
                            creatorId={actorId}
                            initialType={
                                role === 'educator'
                                    ? 'activity'
                                    : 'challenge'
                            }
                            activities={definitions
                                .filter((definition) => definition.type === 'activity')
                                .map((definition) => ({
                                    id: definition.id,
                                    title: definition.title,
                                    description: definition.description,
                                    xp_value: definition.xp_value,
                                    verification: definition.verification,
                                }))}
                            onCancel={() => setShowModal(false)}
                            onCreated={handleCreated}                        />
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
