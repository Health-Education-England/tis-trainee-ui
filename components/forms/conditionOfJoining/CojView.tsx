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
        // validateOnChange={false}
        // validateOnBlur={false}
        initialValues={{
          declareProvisional: "",
          declareSatisfy: "",
          declareProvide: "",
          declareInform: "",
          declareUpToDate: "",
          declareAttend: "",
          declareEngage: ""
        }}
        validationSchema={Yup.object({
          declareProvisional: Yup.string().required(
            "Please confirm your acceptance"
          ),
          declareSatisfy: Yup.string().required(
            "Please confirm your acceptance"
          ),
          declareProvide: Yup.string().required(
            "Please confirm your acceptance"
          ),
          declareInform: Yup.string().required(
            "Please confirm your acceptance"
          ),
          declareUpToDate: Yup.string().required(
            "Please confirm your acceptance"
          ),
          declareAttend: Yup.string().required(
            "Please confirm your acceptance"
          ),
          declareEngage: Yup.string().required("Please confirm your acceptance")
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
              id="declareProvisional"
              type="checkbox"
              name="declareProvisional"
              items={[
                {
                  label: `I understand that programme and post allocations are provisional and subject to change until confirmed by HEE WM and/or my employing organisation.`,
                  value: true
                }
              ]}
            />
            <MultiChoiceInputField
              id="declareSatisfy"
              type="checkbox"
              name="declareSatisfy"
              items={[
                {
                  label:
                    "I understand that I will need to satisfy all requirements of the programme and curriculum to enable satisfactory sign off, and that this may require a specific time commitment.",
                  value: true
                }
              ]}
            />
            <MultiChoiceInputField
              id="declareProvide"
              type="checkbox"
              name="declareProvide"
              items={[
                {
                  label: `I will obtain and provide my School and HEE WM with a professional email address.`,
                  value: true
                }
              ]}
            />
            <MultiChoiceInputField
              id="declareInform"
              type="checkbox"
              name="declareInform"
              items={[
                {
                  label: `I will inform my School and HEE WM of any change of my personal contact details and/or personal circumstances that may affect my training programme arrangements.`,
                  value: true
                }
              ]}
            />
            <MultiChoiceInputField
              id="declareUpToDate"
              type="checkbox"
              name="declareUpToDate"
              items={[
                {
                  label: `I will keep myself up to date with the latest information available via HEE as well as via the relevant educational and regulatory websites.`,
                  value: true
                }
              ]}
            />
            <MultiChoiceInputField
              id="declareAttend"
              type="checkbox"
              name="declareAttend"
              items={[
                {
                  label: `I will attend the minimum number of formal teaching days as required by my School/programme.`,
                  value: true
                }
              ]}
            />
            <MultiChoiceInputField
              id="declareEngage"
              type="checkbox"
              name="declareEngage"
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
