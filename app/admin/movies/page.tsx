import { ContentType } from "@prisma/client";
import { ContentListPage } from "@/components/admin/content/ContentListPage";

export const metadata = { title: "Movies" };

export default function AdminMoviesPage({
  searchParams
}: {
  searchParams: { q?: string; status?: string; page?: string };
}) {
  return (
    <ContentListPage
      fixedType={ContentType.MOVIE}
      basePath="/admin/movies"
      searchParams={searchParams}
    />
  );
}
