import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/hooks/hooks";
import { updatedRedirected } from "../../redux/slices/userSlice";

export const useRedirectHandler = () => {
  const dispatch = useAppDispatch();
  const redirected = useAppSelector(state => state.user.redirected);
  const location = useLocation();
  const isMatchedQueryParamsRedirect =
    new URLSearchParams(location.search).get("redirected") === "1";

  // Update the redirected state in Redux if needed
  useEffect(() => {
    if (isMatchedQueryParamsRedirect && !redirected) {
      dispatch(updatedRedirected(true));
    }
  }, [isMatchedQueryParamsRedirect, redirected, dispatch]);

  // Clean up URL params to avoid it being bookmarked
  useEffect(() => {
    if (redirected || isMatchedQueryParamsRedirect) {
      const params = new URLSearchParams(location.search);
      params.delete("redirected");

      window.history.pushState(
        null,
        "",
        location.pathname + (params.toString() ? "?" + params.toString() : "")
      );
    }
  }, [
    redirected,
    isMatchedQueryParamsRedirect,
    location.pathname,
    location.search
  ]);
};
