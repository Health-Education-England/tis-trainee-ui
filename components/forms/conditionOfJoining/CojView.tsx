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
import {
  COJ_DECLARATIONS_10,
  COJ_DECLARATIONS_9
} from "../../../utilities/Constants";
import { DateUtilities } from "../../../utilities/DateUtilities";
import FormSavePDF from "../FormSavePDF";
import CojGg10 from "./CojGg10";
import CojGg9 from "./CojGg9";
import { useAppSelector } from "../../../redux/hooks/hooks";
import ErrorPage from "../../common/ErrorPage";

// set intiial values
const initialValuesDefault = {
  isDeclareProvisional: "",
  isDeclareSatisfy: "",
  isDeclareProvide: "",
  isDeclareInform: "",
  isDeclareUpToDate: "",
  isDeclareAttend: "",
  isDeclareEngage: ""
};
const initialValues10 = {
  ...initialValuesDefault,
  isDeclareContacted: ""
};

// set validation schema
const acceptanceValidation = Yup.bool()
  .nullable()
  .oneOf([true], "Please confirm your acceptance")
  .required("Please confirm your acceptance");
const validationSchemaDefault = Yup.object({
  isDeclareProvisional: acceptanceValidation,
  isDeclareSatisfy: acceptanceValidation,
  isDeclareProvide: acceptanceValidation,
  isDeclareInform: acceptanceValidation,
  isDeclareUpToDate: acceptanceValidation,
  isDeclareAttend: acceptanceValidation,
  isDeclareEngage: acceptanceValidation
});
const validationSchema10 = Yup.object({
  ...validationSchemaDefault.fields,
  isDeclareContacted: acceptanceValidation
});

export default function CojView() {
  const pmId = window.location.pathname.split("/")[2];
  const matchedPm = useAppSelector(state =>
    state.traineeProfile.traineeProfileData.programmeMemberships.find(
      pm => pm.tisId === pmId
    )
  );

  if (!matchedPm) {
    return (
      <ErrorPage message="There was a problem displaying the Conditions of Joining information for this Programme Membership." />
    );
  } else {
    const progName = matchedPm.programmeName;
    const progId = matchedPm.tisId as string;
    const isVerson10 = matchedPm.conditionsOfJoining.version === "GG10";
    const CojFormVersion = isVerson10 ? (
      <CojGg10 progName={progName} />
    ) : (
      <CojGg9 progName={progName} />
    );
    const signedDate = matchedPm.conditionsOfJoining.signedAt
      ? new Date(matchedPm.conditionsOfJoining.signedAt)
      : null;

    return (
      <>
        {signedDate && (
          <FormSavePDF history={history} path={"/programmes"} pmId={pmId} />
        )}
        <ScrollTo />
        {CojFormVersion}
        <CojDeclarationSection
          signedDate={signedDate}
          initialValues={isVerson10 ? initialValues10 : initialValuesDefault}
          validationSchema={
            isVerson10 ? validationSchema10 : validationSchemaDefault
          }
          declarations={isVerson10 ? COJ_DECLARATIONS_10 : COJ_DECLARATIONS_9}
          matchedPmId={progId}
        />
      </>
    );
  }
}

type CojDeclarationSectionProps = {
  signedDate: Date | null;
  initialValues: Record<string, string>;
  validationSchema: Yup.ObjectSchema<any>;
  declarations: { id: string; label: string }[];
  matchedPmId: string;
};
function CojDeclarationSection({
  signedDate,
  initialValues,
  validationSchema,
  declarations,
  matchedPmId
}: Readonly<CojDeclarationSectionProps>) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async _values => {
        await store.dispatch(signCoj(matchedPmId));
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
          {declarations.map(declaration => (
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
