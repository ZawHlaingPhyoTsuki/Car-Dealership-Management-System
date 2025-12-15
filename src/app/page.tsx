import { LayoutDashboard, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';
import Image from 'next/image';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session) {
        redirect('/dashboard');
    }

    return (
        <div className="relative h-screen w-full overflow-hidden bg-zinc-950 text-white selection:bg-white/20 selection:text-white">
            <div
                className="absolute inset-0 z-0 scale-105 animate-in fade-in duration-1000"
                style={{
                    backgroundImage: "url('/images/main.webp')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <div className="absolute inset-0 z-10 bg-linear-to-t from-black/90 via-black/50 to-black/40" />

            <main className="relative z-20 flex h-full flex-col items-center justify-center px-4">
                <div className="w-full max-w-lg space-y-8 rounded-3xl border border-white/10 bg-zinc-900/20 p-8 backdrop-blur-xl shadow-2xl sm:p-12 animate-in slide-in-from-bottom-8 duration-700">
                    <div className="text-center space-y-2">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
                            <Image
                                src="/images/logo.jpg"
                                width={50}
                                height={50}
                                className="rounded-full overflow-hidden"
                                alt="Logo"
                            />
                        </div>

                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-white drop-shadow-md">
                            7hrs <span className="text-zinc-200">Automobile</span>
                        </h1>

                        <p className="text-lg text-zinc-300 font-medium tracking-wide">
                            Management System
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-linear-to-r from-transparent via-white/15 to-transparent" />
                    <div className="space-y-4">
                        <Button
                            size="lg"
                            className="group relative w-full h-14 text-lg font-semibold overflow-hidden rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 transition-all duration-300 border-0"
                            asChild
                        >
                            <Link href={paths.dashboard.root.getHref()}>
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <LayoutDashboard className="h-5 w-5" />
                                    Enter Dashboard
                                </span>
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-zinc-900/5 to-transparent z-0" />
                            </Link>
                        </Button>

                        <div className="flex items-center justify-center gap-2 text-xs text-zinc-400 uppercase tracking-widest">
                            <ShieldCheck className="h-4 w-4" />
                            <span>Admin Access Only</span>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-6 flex flex-col items-center gap-4 animate-in fade-in delay-500 duration-1000">
                    <p className="text-[10px] text-zinc-300 font-light tracking-widest mix-blend-plus-lighter">
                        INTERNAL SYSTEM • AUTHORIZED PERSONNEL
                    </p>
                </div>
            </main>
        </div>
    );
}
