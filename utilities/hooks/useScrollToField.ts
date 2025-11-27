import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useScrollToField = (fieldName: string) => {
  const location = useLocation<{ fieldName: string }>();

  useEffect(() => {
    if (location.state?.fieldName === fieldName) {
      const fieldElement = document.getElementById(fieldName);
      if (fieldElement) {
        fieldElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [fieldName, location.state]);
};
