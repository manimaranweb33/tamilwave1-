import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { ContentForm } from "@/components/admin/content/ContentForm";
import { canEditContent } from "@/lib/auth/permissions";

export const metadata = { title: "New content" };

export default async function NewContentPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!canEditContent({ id: session.user.id, email: session.user.email!, role: session.user.role })) {
    redirect("/admin/content");
  }

  return (
    <div>
      <h1 className="text-2xl font-black">Add content</h1>
      <div className="mt-6">
        <ContentForm />
      </div>
    </div>
  );
}
