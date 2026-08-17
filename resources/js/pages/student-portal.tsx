import { Head } from '@inertiajs/react';
import { Box, PortalPage } from '@/components/portal-page';

type Level = {
    id: number;
    level: number;
    xp_threshold: number;
    capability: string;
};

export default function StudentPortal({ levels }: { levels: Level[] }) {
    return (
        <>
            <Head title="Student Portal Prototype" />
            <PortalPage
                label="STUDENT PORTAL"
                title="My XP progress"
                description="Students will use this area to see their XP, level, unlocked capabilities, available challenges and XP history."
            >
                <div className="grid gap-4 md:grid-cols-3">
                    <Box title="Current XP">
                        <p className="text-4xl font-bold">0 XP</p>
                        <p className="mt-2 text-sm text-gray-500">
                            Demo student
                        </p>
                    </Box>
                    <Box title="Current level">
                        <p className="text-4xl font-bold">Level 1</p>
                        <p className="mt-2 text-sm text-gray-500">
                            Student Profile unlocked
                        </p>
                    </Box>
                    <Box title="Next unlock">
                        <p className="text-xl font-bold">
                            Basic Job Applications
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                            Earn 100 XP
                        </p>
                    </Box>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <Box title="Progression path">
                        <div className="space-y-2">
                            {levels.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between border-b border-gray-200 py-2 text-sm"
                                >
                                    <span>
                                        Level {item.level}: {item.capability}
                                    </span>
                                    <span>{item.xp_threshold} XP</span>
                                </div>
                            ))}
                        </div>
                    </Box>
                    <Box title="Recent XP history">
                        <p className="rounded border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                            No XP transactions yet.
                        </p>
                    </Box>
                </div>
            </PortalPage>
        </>
    );
}
