import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const useScrollToField = (
  fieldNameOrPredicate: string | ((target: string) => boolean)
) => {
  const location = useLocation<{ fieldName: string }>();
  const scrolledToTarget = useRef<string | null>(null);

  const predicateRef = useRef(fieldNameOrPredicate);
  predicateRef.current = fieldNameOrPredicate;

  useEffect(() => {
    const target = location.state?.fieldName;
    if (!target) return;

    if (scrolledToTarget.current === target) return;

    const currentPredicate = predicateRef.current;
    const shouldScroll =
      typeof currentPredicate === "function"
        ? currentPredicate(target)
        : target === currentPredicate;

    if (shouldScroll) {
      // Note: setTimeout here to push this targeting task to the end of the event loop so page is rendered (with id updates etc.).
      setTimeout(() => {
        if (scrolledToTarget.current === target) return;

        const fieldElement = document.getElementById(target);
        if (fieldElement) {
          fieldElement.scrollIntoView({ behavior: "smooth", block: "center" });
          scrolledToTarget.current = target;
        }
      }, 0);
    }
  }, [location.state]);
};
