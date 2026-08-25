import { useMemo, useState } from 'react';
import LibraryCard, {
    type LibraryItem,
} from '@/components/management/library-card';


type Filter = 'all' | 'activity' | 'challenge';

type Props = {
    items: LibraryItem[];
    onCreate: () => void;
};

export default function ManagementLibrary({
    items,
    onCreate,
}: Props) {
    const [filter, setFilter] = useState<Filter>('all');
    const [search, setSearch] = useState('');

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const matchesType =
                filter === 'all' || item.type === filter;

            const matchesSearch =
                item.title
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                (item.description ?? '')
                    .toLowerCase()
                    .includes(search.toLowerCase());

            return matchesType && matchesSearch;
        });
    }, [items, filter, search]);

    return (
        <section className="mt-4 rounded-2xl border border-gray-200 bg-[#fbf9fc] p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Activities & Challenges Library
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Manage activities and challenges available through the
                        gamification engine.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onCreate}
                    className="rounded-full bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
                >
                    + Create new challenge/activity
                </button>
            </div>

            <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-2">
                    <FilterButton
                        active={filter === 'all'}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </FilterButton>

                    <FilterButton
                        active={filter === 'activity'}
                        onClick={() => setFilter('activity')}
                    >
                        Activities
                    </FilterButton>

                    <FilterButton
                        active={filter === 'challenge'}
                        onClick={() => setFilter('challenge')}
                    >
                        Challenges
                    </FilterButton>
                </div>

                <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search activities and challenges"
                    className="w-full rounded-full border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-purple-400 md:max-w-xs"
                />
            </div>

            {filteredItems.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
                    <h3 className="font-semibold text-gray-800">
                        No challenges yet
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                        Create your first activity or challenge to get started.
                    </p>
                </div>
            ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredItems.map((item) => (
                        <LibraryCard
                            key={item.id}
                            item={item}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

function FilterButton({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
                active
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-50 text-gray-600 hover:bg-purple-100'
            }`}
        >
            {children}
        </button>
    );
}