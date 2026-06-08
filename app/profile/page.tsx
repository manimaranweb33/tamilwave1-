import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/user/session";
import { UserSessionProvider } from "@/components/auth/UserSessionProvider";

export default async function ProfilePage() {
  const user = await getUserSession();
  if (!user) redirect("/login");

  return (
    <UserSessionProvider>
      <div className="shell py-10">
        <p className="text-[10px] font-black uppercase tracking-[.2em] text-wave">Your Account</p>
        <h1 className="mt-2 text-3xl font-black">Profile</h1>
        <div className="mt-8 max-w-lg rounded-2xl border border-line bg-panel p-6">
          <div className="flex items-center gap-4">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt="" className="h-16 w-16 rounded-full border border-line object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-elevated text-xl font-black text-wave">
                {(user.name ?? user.email)[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-lg font-black">{user.name ?? "TamilWave Member"}</p>
              <p className="text-sm text-zinc-400">{user.email}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <Link href="/watchlist" className="rounded-xl border border-line px-4 py-3 text-sm font-bold hover:border-wave">
              My Watchlist
            </Link>
            <Link href="/ratings" className="rounded-xl border border-line px-4 py-3 text-sm font-bold hover:border-wave">
              My Ratings
            </Link>
            <Link href="/settings" className="rounded-xl border border-line px-4 py-3 text-sm font-bold hover:border-wave">
              Settings
            </Link>
          </div>
        </div>
      </div>
    </UserSessionProvider>
  );
}
