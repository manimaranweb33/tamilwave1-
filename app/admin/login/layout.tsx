import { SessionProvider } from "@/components/admin/providers/SessionProvider";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
