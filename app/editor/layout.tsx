import { editorAuth } from "@/lib/auth/editor-auth";
import { EditorSidebar } from "@/components/admin/layout/EditorSidebar";
import { EditorHeader } from "@/components/admin/layout/EditorHeader";
import { EditorSessionProvider } from "@/components/auth/EditorSessionProvider";

export default async function EditorLayout({ children }: { children: React.ReactNode }) {
  const session = await editorAuth();
  if (!session?.user) {
    return <>{children}</>;
  }

  return (
    <EditorSessionProvider>
      <div className="flex min-h-screen bg-ink text-white">
        <EditorSidebar />
        <div className="flex flex-1 flex-col">
          <EditorHeader email={session.user.email ?? ""} role={session.user.role} />
          <div className="flex-1 p-6">{children}</div>
        </div>
      </div>
    </EditorSessionProvider>
  );
}
