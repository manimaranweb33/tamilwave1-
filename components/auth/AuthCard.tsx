import { Logo } from "@/components/logo";

export function AuthCard({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-line bg-panel p-8 shadow-card">
      <div className="mb-6 flex justify-center">
        <Logo />
      </div>
      <p className="text-center text-[10px] font-black uppercase tracking-[.2em] text-wave">TamilWave</p>
      <h1 className="mt-2 text-center text-2xl font-black text-white">{title}</h1>
      <p className="mt-2 text-center text-sm text-zinc-400">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}
