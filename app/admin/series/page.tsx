import { ContentType } from "@prisma/client";
import { ContentListPage } from "@/components/admin/content/ContentListPage";

export const metadata = { title: "Web Series" };

export default function AdminSeriesPage({
  searchParams
}: {
  searchParams: { q?: string; status?: string; page?: string };
}) {
  return (
    <ContentListPage
      fixedType={ContentType.WEB_SERIES}
      basePath="/admin/series"
      searchParams={searchParams}
    />
  );
}
