import ScrollTo from "../ScrollTo";
import {
  COJ_DECLARATIONS_10,
  COJ_DECLARATIONS_11,
  COJ_DECLARATIONS_9,
  COJ_EPOCH,
  COJ_START_DATE_BEFORE_EPOCH_ERROR_MESSAGE,
  NO_MATCHING_PM_ERROR_MESSAGE,
  UNKNOWN_COJ_VERSION_ERROR_MESSAGE
} from "../../../utilities/Constants";
import FormSavePDF from "../FormSavePDF";
import CojGg10 from "./CojGg10";
import CojGg11 from "./CojGg11";
import CojGg9 from "./CojGg9";
import { useAppSelector } from "../../../redux/hooks/hooks";
import ErrorPage from "../../common/ErrorPage";
import { CojDeclarationForm } from "./CojDeclarationForm";
import { useLocation } from "react-router-dom";

export default function CojView() {
  const pmId = useLocation().pathname.split("/")[2];
  const matchedPm = useAppSelector(state =>
    state.traineeProfile.traineeProfileData.programmeMemberships.find(
      pm => pm.tisId === pmId
    )
  );
  if (!matchedPm) {
    return <ErrorPage message={NO_MATCHING_PM_ERROR_MESSAGE} />;
  }
  if (new Date(matchedPm.startDate) < COJ_EPOCH) {
    return <ErrorPage message={COJ_START_DATE_BEFORE_EPOCH_ERROR_MESSAGE} />;
  } else {
    const progName = matchedPm.programmeName;
    const progId = matchedPm.tisId as string;
    const cojVersion = matchedPm.conditionsOfJoining.version;
    const CojFormVersion = {
      GG9: <CojGg9 progName={progName} />,
      GG10: <CojGg10 progName={progName} />,
      GG11: <CojGg11 progName={progName} />
    }[cojVersion];
    const cojDeclarations = {
      GG9: COJ_DECLARATIONS_9,
      GG10: COJ_DECLARATIONS_10,
      GG11: COJ_DECLARATIONS_11
    }[cojVersion];
    if (!CojFormVersion || !cojDeclarations) {
      return <ErrorPage message={UNKNOWN_COJ_VERSION_ERROR_MESSAGE} />;
    }
    const signedDate = matchedPm.conditionsOfJoining.signedAt
      ? new Date(matchedPm.conditionsOfJoining.signedAt)
      : null;

    return (
      <>
        {signedDate && <FormSavePDF pmId={pmId} />}
        <ScrollTo />
        {CojFormVersion}
        <CojDeclarationForm
          signedDate={signedDate}
          declarations={cojDeclarations}
          matchedPmId={progId}
        />
      </>
    );
  }
}
