import { AdminSessionProvider } from "@/components/auth/AdminSessionProvider";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <AdminSessionProvider>{children}</AdminSessionProvider>;
}
