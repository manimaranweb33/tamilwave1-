import { ContentListPage } from "@/components/admin/content/ContentListPage";

export const metadata = { title: "Content" };

export default function AdminContentPage({
  searchParams
}: {
  searchParams: { q?: string; type?: string; status?: string; page?: string };
}) {
  return <ContentListPage basePath="/admin/content" searchParams={searchParams} />;
}
