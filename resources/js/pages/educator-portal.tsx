import { Head } from '@inertiajs/react';
import { Box, PortalPage } from '@/components/portal-page';

type Definition = {
    id: number;
    title: string;
    type: string;
    xp_value: number;
    verification: string;
};

export default function EducatorPortal({
    definitions,
}: {
    definitions: Definition[];
}) {
    return (
        <>
            <Head title="Educator Portal Prototype" />
            <PortalPage
                label="EDUCATOR PORTAL"
                title="Learning activity management"
                description="Educators will assign approved learning activities, review student completion evidence and send verified awards to the XP engine."
            >
                <div className="grid gap-4 md:grid-cols-3">
                    <Box title="Pending reviews">
                        <p className="text-4xl font-bold">0</p>
                    </Box>
                    <Box title="Active activities">
                        <p className="text-4xl font-bold">
                            {definitions.length}
                        </p>
                    </Box>
                    <Box title="Students participating">
                        <p className="text-4xl font-bold">0</p>
                    </Box>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <Box title="Configured education rewards">
                        <div className="space-y-2">
                            {definitions.length === 0 ? (
                                <p className="text-sm text-gray-500">
                                    No matching definitions configured.
                                </p>
                            ) : (
                                definitions.map((item) => (
                                    <div
                                        key={item.id}
                                        className="rounded border border-gray-300 p-3"
                                    >
                                        <p className="font-bold">
                                            {item.title}
                                        </p>
                                        <p className="text-sm text-gray-500 capitalize">
                                            {item.type} · {item.verification}{' '}
                                            approval
                                        </p>
                                        <p className="mt-1 font-bold text-green-700">
                                            {item.xp_value} XP
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </Box>
                    <Box title="Completion approvals">
                        <p className="rounded border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                            Student submissions requiring educator approval will
                            appear here.
                        </p>
                    </Box>
                </div>
            </PortalPage>
        </>
    );
}
