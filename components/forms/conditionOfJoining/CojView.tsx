import { Formik } from "formik";
import { Button, SummaryList } from "nhsuk-react-components";
import { useEffect } from "react";
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
            <MultiChoiceInputField
              id="isDeclareProvisional"
              type="checkbox"
              name="isDeclareProvisional"
              items={[
                {
                  label: `I understand that programme and post allocations are provisional and subject to change until confirmed by HEE WM and/or my employing organisation.`,
                  value: true
                }
              ]}
            />
            <MultiChoiceInputField
              id="isDeclareSatisfy"
              type="checkbox"
              name="isDeclareSatisfy"
              items={[
                {
                  label:
                    "I understand that I will need to satisfy all requirements of the programme and curriculum to enable satisfactory sign off, and that this may require a specific time commitment.",
                  value: true
                }
              ]}
            />
            <MultiChoiceInputField
              id="isDeclareProvide"
              type="checkbox"
              name="isDeclareProvide"
              items={[
                {
                  label: `I will obtain and provide my School and HEE WM with a professional email address.`,
                  value: true
                }
              ]}
            />
            <MultiChoiceInputField
              id="isDeclareInform"
              type="checkbox"
              name="isDeclareInform"
              items={[
                {
                  label: `I will inform my School and HEE WM of any change of my personal contact details and/or personal circumstances that may affect my training programme arrangements.`,
                  value: true
                }
              ]}
            />
            <MultiChoiceInputField
              id="isDeclareUpToDate"
              type="checkbox"
              name="isDeclareUpToDate"
              items={[
                {
                  label: `I will keep myself up to date with the latest information available via HEE as well as via the relevant educational and regulatory websites.`,
                  value: true
                }
              ]}
            />
            <MultiChoiceInputField
              id="isDeclareAttend"
              type="checkbox"
              name="isDeclareAttend"
              items={[
                {
                  label: `I will attend the minimum number of formal teaching days as required by my School/programme.`,
                  value: true
                }
              ]}
            />
            <MultiChoiceInputField
              id="isDeclareEngage"
              type="checkbox"
              name="isDeclareEngage"
              items={[
                {
                  label: `Where applicable, I will fully engage with immigration and employer requirements relating to Tier 2 and Tier 4 UK visas.`,
                  value: true
                }
              ]}
            />
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
