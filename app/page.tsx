import { auth, signIn } from "@/auth"
import Image from "next/image"
import { DevLabel } from "@/components/DevLabel"

export default async function Home() {
    const session = await auth()

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">

            {/* Background gradient blobs */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full" />
            </div>

            <main className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">

                {/* Logo */}
                <div className="relative w-16 h-16">
                    <Image src="/assets/favicon.png" alt="Logo" fill className="object-contain" />
                </div>

                <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-black tracking-tight">App Kaizen</h1>
                    <DevLabel />
                </div>

                <p className="text-zinc-400 text-base max-w-sm">
                    Platform is being set up. Sign in to continue.
                </p>

                {session ? (
                    <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900/80 border border-white/10 rounded-full">
                        {session.user?.image && (
                            <img src={session.user.image} alt="avatar" className="w-7 h-7 rounded-full" />
                        )}
                        <span className="text-sm text-zinc-300">{session.user?.name}</span>
                    </div>
                ) : (
                    <form
                        action={async () => {
                            "use server"
                            await signIn("google")
                        }}
                    >
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-zinc-200 transition-colors"
                        >
                            <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-5 h-5" />
                            Sign in with Google
                        </button>
                    </form>
                )}
            </main>
        </div>
    )
}
