import { ContentListPage } from "@/components/admin/content/ContentListPage";

export const metadata = { title: "All Content" };

export default function EditorContentPage({
  searchParams
}: {
  searchParams: { q?: string; type?: string; status?: string; page?: string };
}) {
  return (
    <ContentListPage basePath="/editor/content" searchParams={searchParams} portal="editor" />
  );
}
