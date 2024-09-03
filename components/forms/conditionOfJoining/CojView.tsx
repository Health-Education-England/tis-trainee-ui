import { Formik } from "formik";
import { Button, SummaryList } from "nhsuk-react-components";
import {
  signCoj,
  updatedTraineeProfileStatus
} from "../../../redux/slices/traineeProfileSlice";
import store from "../../../redux/store/store";
import history from "../../navigation/history";
import MultiChoiceInputField from "../MultiChoiceInputField";
import ScrollTo from "../ScrollTo";
import * as Yup from "yup";
import { Redirect } from "react-router-dom";
import { updatedsigningCoj } from "../../../redux/slices/userSlice";
import {
  COJ_DECLARATIONS_10,
  COJ_DECLARATIONS_9
} from "../../../utilities/Constants";
import { DateUtilities } from "../../../utilities/DateUtilities";
import FormSavePDF from "../FormSavePDF";
import CojGg10 from "./CojGg10";
import CojGg9 from "./CojGg9";

const acceptanceValidation = Yup.bool()
  .nullable()
  .oneOf([true], "Please confirm your acceptance")
  .required("Please confirm your acceptance");

export default function CojView() {
  const {
    signingCojProgName: progName,
    signingCojSignedDate: signedDate,
    signingCoj,
    signingCojVersion
  } = store.getState().user;

  if (!signingCoj) return <Redirect to="/programmes" />;

  return progName ? (
    <>
      {signedDate && <FormSavePDF history={history} path={"/programmes"} />}
      <ScrollTo />
      <CojVersion progName={progName} version={signingCojVersion} />
      {signingCojVersion === "GG9" && (
        <CojDeclarationSection9 signedDate={signedDate} />
      )}
      {signingCojVersion === "GG10" && (
        <CojDeclarationSection10 signedDate={signedDate} />
      )}
    </>
  ) : null;
}

function CojDeclarationSection9({
  signedDate
}: Readonly<{ signedDate: Date | null }>) {
  return (
    <Formik
      initialValues={{
        isDeclareProvisional: "",
        isDeclareSatisfy: "",
        isDeclareProvide: "",
        isDeclareInform: "",
        isDeclareUpToDate: "",
        isDeclareAttend: "",
        isDeclareEngage: ""
      }}
      validationSchema={Yup.object({
        isDeclareProvisional: acceptanceValidation,
        isDeclareSatisfy: acceptanceValidation,
        isDeclareProvide: acceptanceValidation,
        isDeclareInform: acceptanceValidation,
        isDeclareUpToDate: acceptanceValidation,
        isDeclareAttend: acceptanceValidation,
        isDeclareEngage: acceptanceValidation
      })}
      onSubmit={async _values => {
        const signingCojPmId = store.getState().user.signingCojPmId;
        await store.dispatch(signCoj(signingCojPmId));
        store.dispatch(updatedsigningCoj(false));
        store.dispatch(updatedTraineeProfileStatus("idle"));
        history.push("/programmes");
      }}
    >
      {({ handleSubmit, isValid, isSubmitting }) => (
        <>
          <SummaryList noBorder>
            <SummaryList.Row>
              <SummaryList.Value>
                In addition, I acknowledge the following specific information
                requirements:
              </SummaryList.Value>
            </SummaryList.Row>
          </SummaryList>
          {COJ_DECLARATIONS_9.map(declaration => (
            <MultiChoiceInputField
              key={declaration.id}
              id={declaration.id}
              type="checkbox"
              name={declaration.id}
              canEdit={!signedDate}
              checked={!!signedDate}
              items={[
                {
                  label: declaration.label,
                  value: true
                }
              ]}
            />
          ))}
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
              disabled={!isValid || isSubmitting}
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

function CojDeclarationSection10({
  signedDate
}: Readonly<{ signedDate: Date | null }>) {
  return (
    <Formik
      initialValues={{
        isDeclareProvisional: "",
        isDeclareSatisfy: "",
        isDeclareProvide: "",
        isDeclareInform: "",
        isDeclareUpToDate: "",
        isDeclareAttend: "",
        isDeclareContacted: "",
        isDeclareEngage: ""
      }}
      validationSchema={Yup.object({
        isDeclareProvisional: acceptanceValidation,
        isDeclareSatisfy: acceptanceValidation,
        isDeclareProvide: acceptanceValidation,
        isDeclareInform: acceptanceValidation,
        isDeclareUpToDate: acceptanceValidation,
        isDeclareAttend: acceptanceValidation,
        isDeclareContacted: acceptanceValidation,
        isDeclareEngage: acceptanceValidation
      })}
      onSubmit={async _values => {
        const signingCojPmId = store.getState().user.signingCojPmId;
        await store.dispatch(signCoj(signingCojPmId));
        store.dispatch(updatedsigningCoj(false));
        store.dispatch(updatedTraineeProfileStatus("idle"));
        history.push("/programmes");
      }}
    >
      {({ handleSubmit, isValid, isSubmitting }) => (
        <>
          <SummaryList noBorder>
            <SummaryList.Row>
              <SummaryList.Value>
                In addition, I acknowledge the following specific information
                requirements:
              </SummaryList.Value>
            </SummaryList.Row>
          </SummaryList>
          {COJ_DECLARATIONS_10.map(declaration => (
            <MultiChoiceInputField
              key={declaration.id}
              id={declaration.id}
              type="checkbox"
              name={declaration.id}
              canEdit={!signedDate}
              checked={!!signedDate}
              items={[
                {
                  label: declaration.label,
                  value: true
                }
              ]}
            />
          ))}
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
              disabled={!isValid || isSubmitting}
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

type COJversionType = {
  progName: string;
  version: string;
};
function CojVersion({ progName, version }: Readonly<COJversionType>) {
  if (version === "GG9") {
    return <CojGg9 progName={progName} />;
  }
  return <CojGg10 progName={progName} />;
}
