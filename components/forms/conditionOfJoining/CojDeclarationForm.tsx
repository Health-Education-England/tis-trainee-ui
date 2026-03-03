import { useState } from "react";
import { Formik } from "formik";
import { Button, SummaryList } from "nhsuk-react-components";
import {
  signCoj,
  updatedTraineeProfileStatus
} from "../../../redux/slices/traineeProfileSlice";
import { DateUtilities } from "../../../utilities/DateUtilities";
import store from "../../../redux/store/store";
import Declarations from "../Declarations";
import history from "../../navigation/history";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { useIsPhNonMedic } from "../../../utilities/hooks/useIsPhNonMedic";

type CojDeclarationFormProps = {
  signedDate: Date | null;
  declarations: { name: string; label: string }[];
  matchedPmId: string;
};
export function CojDeclarationForm({
  signedDate,
  declarations,
  matchedPmId
}: Readonly<CojDeclarationFormProps>) {
  const [canSubmit, setCanSubmit] = useState(false);
  const isPhNonMedic = useIsPhNonMedic();
  return (
    <Formik
      initialValues={[]}
      onSubmit={async _values => {
        await store.dispatch(signCoj(matchedPmId));
        store.dispatch(updatedTraineeProfileStatus("idle"));
        history.push("/programmes");
      }}
    >
      {({ handleSubmit, isSubmitting }) => (
        <>
          <SummaryList noBorder>
            <SummaryList.Row>
              <SummaryList.Value>
                In addition, I acknowledge the following specific information
                requirements:
              </SummaryList.Value>
            </SummaryList.Row>
            {isPhNonMedic && (
              <SummaryList.Row>
                <SummaryList.Value>
                  <div className="info-message-container">
                    <span className="info-message-icon">
                      <FontAwesomeIcon icon={faInfoCircle} size="xl" />
                    </span>
                    <span className="info-message">
                      If you are appointed as a{" "}
                      <b>Public Health Non-Medical trainee</b>, any references
                      to{" "}
                      <b>
                        GMC registration, Licensing, or medical Revalidation
                      </b>{" "}
                      are <b>not applicable</b> to your role.
                      <br />
                      <br />
                      By signing these Conditions of Joining, you confirm your
                      agreement with <b>only the applicable conditions</b> for
                      your training programme.
                    </span>
                  </div>
                </SummaryList.Value>
              </SummaryList.Row>
            )}
          </SummaryList>
          <Declarations
            setCanSubmit={setCanSubmit}
            canEdit={!signedDate}
            formDeclarations={declarations}
          />
          <SummaryList noBorder>
            <SummaryList.Row>
              <SummaryList.Value>
                I acknowledge the importance of these responsibilities and
                understand that they are requirements for maintaining my
                registration with the Postgraduate Dean. If I fail to meet them,
                I understand that my training number/contract may be withdrawn
                by the Postgraduate Dean.
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Value>
                I understand that this document does not constitute an offer of
                employment.
              </SummaryList.Value>
            </SummaryList.Row>
          </SummaryList>
          {signedDate ? (
            <SummaryList noBorder>
              <SummaryList.Row>
                <SummaryList.Value data-cy="cojSignedOn">
                  Signed On: {DateUtilities.ConvertToLondonTime(signedDate)}
                </SummaryList.Value>
              </SummaryList.Row>
            </SummaryList>
          ) : (
            <Button
              onClick={(e: { preventDefault: () => void }) => {
                e.preventDefault();
                handleSubmit();
              }}
              disabled={!canSubmit || isSubmitting}
              data-cy="cojSignBtn"
            >
              Click to sign Conditions of Joining agreement
            </Button>
          )}
        </>
      )}
    </Formik>
  );
}
