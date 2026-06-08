import { UserSessionProvider } from "@/components/auth/UserSessionProvider";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserSessionProvider>
      <div className="grid min-h-[calc(100dvh-8rem)] place-items-center bg-ink px-4 py-10">
        {children}
      </div>
    </UserSessionProvider>
  );
}
