import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

export function PortalPage({
    label,
    title,
    description,
    children,
}: {
    label: string;
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <main className="min-h-screen bg-gray-100 px-4 py-8 text-gray-900">
            <div className="mx-auto max-w-5xl">
                <nav className="mb-4 flex flex-wrap gap-2 text-sm">
                    <Link
                        href="/"
                        className="rounded border border-gray-400 bg-white px-3 py-2 hover:bg-gray-50"
                    >
                        Engine demo
                    </Link>
                    <Link
                        href="/student"
                        className="rounded border border-gray-400 bg-white px-3 py-2 hover:bg-gray-50"
                    >
                        Student
                    </Link>
                    <Link
                        href="/management"
                        className="rounded border border-gray-400 bg-white px-3 py-2 hover:bg-gray-50"
                    >
                        Management
                    </Link>
                </nav>
                <header className="mb-6 rounded border border-gray-300 bg-white p-6">
                    <p className="mb-2 text-sm font-bold text-blue-700">
                        {label} - PROTOTYPE
                    </p>
                    <h1 className="text-3xl font-bold">{title}</h1>
                    <p className="mt-3 max-w-3xl text-gray-600">
                        {description}
                    </p>
                </header>
                {children}
                <footer className="py-6 text-center text-sm text-gray-500">
                    Prototype portal - authentication and real workflows are not
                    connected yet.
                </footer>
            </div>
        </main>
    );
}

export function Box({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <section className="rounded border border-gray-300 bg-white p-5">
            <h2 className="mb-3 text-lg font-bold">{title}</h2>
            {children}
        </section>
    );
}
