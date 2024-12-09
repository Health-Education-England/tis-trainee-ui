import { useAppSelector } from "../../../redux/hooks/hooks";
import ErrorPage from "../../common/ErrorPage";
import Loading from "../../common/Loading";
import { CctSavedDraftsTable } from "./CctSavedDraftsTable";

export function CctSavedDrafts() {
  const cctSummaryListStatus = useAppSelector(
    state => state.cctSummaryList.status
  );
  if (cctSummaryListStatus === "loading") {
    return <Loading />;
  }

  if (cctSummaryListStatus === "failed") {
    return (
      <ErrorPage message="There was a problem loading your saved calculations. Please try reloading them by refreshing the page." />
    );
  }

  if (cctSummaryListStatus === "succeeded") {
    return <CctSavedDraftsTable />;
  }
}
