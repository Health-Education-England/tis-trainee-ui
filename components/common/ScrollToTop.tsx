import { useEffect } from "react";

type ScrollToTopProps = {
  errors: any;
  page: number;
  isPageDirty: boolean;
};

export default function ScrollToTop({
  errors,
  page,
  isPageDirty
}: ScrollToTopProps) {
  const errorsLength = Object.keys(errors).length;
  useEffect(() => {
    !isPageDirty && errorsLength < 1 && window.scrollTo(0, 0);
  }, [page, isPageDirty, errorsLength]);

  return null;
}
