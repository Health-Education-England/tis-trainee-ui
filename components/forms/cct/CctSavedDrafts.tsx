import { useAppSelector } from "../../../redux/hooks/hooks";
import ErrorPage from "../../common/ErrorPage";
import Loading from "../../common/Loading";
import { CctSavedDraftsTable } from "./CctSavedDraftsTable";

export function CctSavedDrafts() {
  const cctListStatus = useAppSelector(state => state.cctList.status);

  if (cctListStatus === "loading") return <Loading />;

  if (cctListStatus === "failed")
    return (
      <ErrorPage message="There was a problem loading your saved data. Please try reloading them by refreshing the page." />
    );

  if (cctListStatus === "succeeded") return <CctSavedDraftsTable />;

  return null;
}
