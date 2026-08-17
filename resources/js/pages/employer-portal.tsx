import { Head } from '@inertiajs/react';
import { Box, PortalPage } from '@/components/portal-page';

type Definition = {
    id: number;
    title: string;
    type: string;
    xp_value: number;
    verification: string;
};

export default function EmployerPortal({
    definitions,
}: {
    definitions: Definition[];
}) {
    return (
        <>
            <Head title="Employer Portal Prototype" />
            <PortalPage
                label="EMPLOYER PORTAL"
                title="Gig and challenge management"
                description="Employers will assign approved gigs or challenges, confirm genuine completion and award the configured XP through the engine."
            >
                <div className="grid gap-4 md:grid-cols-3">
                    <Box title="Pending approvals">
                        <p className="text-4xl font-bold">0</p>
                    </Box>
                    <Box title="Active challenges">
                        <p className="text-4xl font-bold">
                            {definitions.length}
                        </p>
                    </Box>
                    <Box title="Completed gigs">
                        <p className="text-4xl font-bold">0</p>
                    </Box>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <Box title="Configured employer rewards">
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
                    <Box title="Gig completion approvals">
                        <p className="rounded border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                            Completed gigs requiring employer verification will
                            appear here.
                        </p>
                    </Box>
                </div>
            </PortalPage>
        </>
    );
}
