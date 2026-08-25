export type LibraryItem = {
    id: string | number;
    title: string;
    description?: string | null;
    type: 'activity' | 'challenge';
    xp_value: number;
    creator_label: string;
    status: string;
};

type Props = {
    item: LibraryItem;
};

export default function LibraryCard({ item }: Props) {
    return (
        <article
            className={`rounded-2xl border p-5 ${
                item.type === 'challenge'
                    ? 'border-pink-100 bg-pink-50'
                    : 'border-gray-100 bg-white'
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-semibold tracking-wide text-purple-600 uppercase">
                    {item.type}
                </p>

                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500 capitalize">
                    {item.status}
                </span>
            </div>

            <h3 className="mt-2 text-base font-semibold text-gray-900">
                {item.title}
            </h3>

            {item.description && (
                <p className="mt-2 text-sm text-gray-500">
                    {item.description}
                </p>
            )}

            <div className="mt-5 flex items-end justify-between gap-4">
                <span className="text-xs text-gray-400 capitalize">
                    Created by {item.creator_label}
                </span>

                <span className="text-sm font-medium text-purple-600">
                    ~{item.xp_value} XP
                </span>
            </div>
        </article>
    );
}