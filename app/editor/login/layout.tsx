import { EditorSessionProvider } from "@/components/auth/EditorSessionProvider";

export default function EditorLoginLayout({ children }: { children: React.ReactNode }) {
  return <EditorSessionProvider>{children}</EditorSessionProvider>;
}
