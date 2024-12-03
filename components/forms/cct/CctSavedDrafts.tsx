import { useAppSelector } from "../../../redux/hooks/hooks";
import style from "../../Common.module.scss";
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
      <DraftsWrapper>
        <ErrorPage message="There was a problem loading your saved calculations. Please try reloading them by refreshing the page." />
      </DraftsWrapper>
    );
  }

  if (cctSummaryListStatus === "succeeded") {
    return (
      <DraftsWrapper>
        <CctSavedDraftsTable />
      </DraftsWrapper>
    );
  }
}

function DraftsWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div data-cy="cct-drafts-wrapper">
      <p className={style.panelSubHeader} data-cy="subheaderDraftCcts">
        Saved calculations
      </p>
      {children}
    </div>
  );
}
