import { Suspense } from "react";
import { SearchPage } from "@/views/search/ui/SearchPage";
import { Loading } from "@/shared/ui/Loading";

export default function Search() {
  return (
    <Suspense fallback={<Loading text="로딩 중..." />}>
      <SearchPage />
    </Suspense>
  );
}
