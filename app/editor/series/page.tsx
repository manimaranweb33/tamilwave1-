import { ContentType } from "@prisma/client";
import { ContentListPage } from "@/components/admin/content/ContentListPage";

export const metadata = { title: "Web Series" };

export default function EditorSeriesPage({
  searchParams
}: {
  searchParams: { q?: string; status?: string; page?: string };
}) {
  return (
    <ContentListPage
      fixedType={ContentType.WEB_SERIES}
      basePath="/editor/series"
      searchParams={searchParams}
      portal="editor"
    />
  );
}
