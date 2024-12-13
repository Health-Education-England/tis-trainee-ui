import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import { useParams } from "react-router-dom";
import { loadSavedCctCalc } from "../../../redux/slices/cctSlice";
import ErrorPage from "../../common/ErrorPage";
import { CctCalcSummary } from "./CctCalcSummary";
import Loading from "../../common/Loading";
import { BackLink } from "nhsuk-react-components";
import history from "../../navigation/history";

export function CctCalcView() {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const newCalcMade = useAppSelector(state => state.cct.newCalcMade);

  useEffect(() => {
    if (id && !newCalcMade) {
      dispatch(loadSavedCctCalc(id));
    }
  }, [id, dispatch, newCalcMade]);

  const cctStatus = useAppSelector(state => state.cct.status);
  const cctDate = useAppSelector(state => state.cct.cctCalc.cctDate);

  if (cctStatus === "loading") {
    return <Loading />;
  }

  if (cctStatus === "failed" || !cctDate) {
    return (
      <ContentWrapper>
        <ErrorPage message="There was a problem displaying your calculation." />
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper>
      <CctCalcSummary />
    </ContentWrapper>
  );
}

function ContentWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <BackLink
        className="back-link"
        data-cy="backLink-to-cct-home"
        onClick={() => history.push("/cct")}
      >
        Back to CCT Home
      </BackLink>
      {children}
    </>
  );
}
