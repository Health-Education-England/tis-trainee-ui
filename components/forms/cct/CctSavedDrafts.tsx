import { useAppSelector } from "../../../redux/hooks/hooks";
import ErrorPage from "../../common/ErrorPage";
import Loading from "../../common/Loading";
import { CctSavedDraftsTable } from "./CctSavedDraftsTable";

export function CctSavedDrafts() {
  const cctSummaryListStatus = useAppSelector(
    state => state.cctSummaryList.status
  );
  const ltftSummaryListStatus = useAppSelector(
    state => state.ltftSummaryList.status
  );

  if (
    cctSummaryListStatus === "loading" ||
    ltftSummaryListStatus === "loading"
  ) {
    return <Loading />;
  }

  if (cctSummaryListStatus === "failed" || ltftSummaryListStatus === "failed") {
    return (
      <ErrorPage message="There was a problem loading your saved data. Please try reloading them by refreshing the page." />
    );
  }

  if (
    cctSummaryListStatus === "succeeded" &&
    ltftSummaryListStatus === "succeeded"
  ) {
    return <CctSavedDraftsTable />;
  }
  return null;
}
