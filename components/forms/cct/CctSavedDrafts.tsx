import { useAppSelector } from "../../../redux/hooks/hooks";
import useIsBetaTester from "../../../utilities/hooks/useIsBetaTester";
import ErrorPage from "../../common/ErrorPage";
import Loading from "../../common/Loading";
import { CctSavedDraftsTable } from "./CctSavedDraftsTable";

export function CctSavedDrafts() {
  const isBetaTester = useIsBetaTester();
  const cctListStatus = useAppSelector(state => state.cctList.status);
  const ltftSummaryListStatus = useAppSelector(
    state => state.ltftSummaryList.status
  );

  if (cctListStatus === "loading" || ltftSummaryListStatus === "loading") {
    return <Loading />;
  }

  if (cctListStatus === "failed" || ltftSummaryListStatus === "failed") {
    return (
      <ErrorPage message="There was a problem loading your saved data. Please try reloading them by refreshing the page." />
    );
  }

  if (
    (isBetaTester &&
      cctListStatus === "succeeded" &&
      ltftSummaryListStatus === "succeeded") ||
    cctListStatus === "succeeded"
  ) {
    return <CctSavedDraftsTable />;
  }
  return null;
}
