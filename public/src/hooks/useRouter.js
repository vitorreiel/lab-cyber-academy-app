import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const router = atomWithStorage('page', 'home');

export function useRouter() {
  const [page, setPage] = useAtom(router);

  return {
    page,
    setPage
  };
}
