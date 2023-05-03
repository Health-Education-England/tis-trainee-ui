import { Formik } from "formik";
import { Button, SummaryList } from "nhsuk-react-components";
import { signCoj } from "../../../redux/slices/traineeProfileSlice";
import store from "../../../redux/store/store";
import history from "../../navigation/history";
import MultiChoiceInputField from "../MultiChoiceInputField";
import ScrollTo from "../ScrollTo";
import CojGg9 from "./CojGg9";
import * as Yup from "yup";
import { acceptanceValidation } from "../formr-part-b/ValidationSchema";
import { Redirect } from "react-router-dom";
import { updatedsigningCoj } from "../../../redux/slices/userSlice";
import { COJ_DECLARATIONS } from "../../../utilities/Constants";

const CojView: React.FC = () => {
  const signingCoj = store.getState().user.signingCoj;
  const progName = store.getState().user.signingCojProgName;

  if (!signingCoj) return <Redirect to="/programmes" />;
  return progName ? (
    <>
      <ScrollTo />
      <CojVersion progName={progName} />
      <CojDeclarationSection />
    </>
  ) : null;
};
export default CojView;

function CojDeclarationSection() {
  return (
    <>
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
            {COJ_DECLARATIONS.map(declaration => (
              <MultiChoiceInputField
                id={declaration.id}
                type="checkbox"
                name={declaration.id}
                items={[
                  {
                    label: declaration.label,
                    value: true
                  }
                ]}
              />
            ))}
            <Button
              onClick={(e: { preventDefault: () => void }) => {
                e.preventDefault();
                handleSubmit();
              }}
              disabled={!isValid || isSubmitting}
              data-cy="cogSignBtn"
            >
              Click to sign Conditions of Joining agreement
            </Button>
          </>
        )}
      </Formik>
    </>
  );
}

type COJversionType = {
  progName: string;
};
function CojVersion({ progName }: COJversionType) {
  return <CojGg9 progName={progName} />;
}
