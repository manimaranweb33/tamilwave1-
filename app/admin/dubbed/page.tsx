import { ContentType } from "@prisma/client";
import { ContentListPage } from "@/components/admin/content/ContentListPage";

export const metadata = { title: "Dubbed Content" };

export default function AdminDubbedPage({
  searchParams
}: {
  searchParams: { q?: string; status?: string; page?: string };
}) {
  return (
    <ContentListPage
      fixedType={ContentType.DUBBED_MOVIE}
      basePath="/admin/dubbed"
      searchParams={searchParams}
    />
  );
}
