import { ContentType } from "@prisma/client";
import { ContentListPage } from "@/components/admin/content/ContentListPage";

export const metadata = { title: "Movies" };

export default function EditorMoviesPage({
  searchParams
}: {
  searchParams: { q?: string; status?: string; page?: string };
}) {
  return (
    <ContentListPage
      fixedType={ContentType.MOVIE}
      basePath="/editor/movies"
      searchParams={searchParams}
      portal="editor"
    />
  );
}
