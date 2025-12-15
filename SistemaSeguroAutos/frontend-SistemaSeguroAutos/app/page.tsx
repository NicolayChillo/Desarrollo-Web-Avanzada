'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function RootPage() {
    const router = useRouter();

    useEffect(() => {
        // Siempre redirigir al login
        router.push('/auth/login');
    }, [router]);

    return (
        <div className="flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <ProgressSpinner />
        </div>
    );
}
