import { ContentType } from "@prisma/client";
import { ContentListPage } from "@/components/admin/content/ContentListPage";

export const metadata = { title: "Dubbed" };

export default function EditorDubbedPage({
  searchParams
}: {
  searchParams: { q?: string; status?: string; page?: string };
}) {
  return (
    <ContentListPage
      fixedType={ContentType.DUBBED_MOVIE}
      basePath="/editor/dubbed"
      searchParams={searchParams}
      portal="editor"
    />
  );
}
