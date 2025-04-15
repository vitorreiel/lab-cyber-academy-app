import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import isEmpty from "lodash.isempty";

const router = atomWithStorage('lab', {});

export function useLab() {
  const [lab, setLab] = useAtom(router);

  const getLabStatus = () => {
    if (isEmpty(lab)) {
      return 'OFFLINE';
    }

    return 'LOADING';
  };

  return {
    lab,
    setLab,
    getLabStatus
  };
}
