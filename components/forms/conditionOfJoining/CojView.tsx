import { Formik } from "formik";
import { Button } from "nhsuk-react-components";
import { useEffect } from "react";
import {
  updatedSignedCoj,
  updatedsigningCojProgName
} from "../../../redux/slices/userSlice";
import store from "../../../redux/store/store";
import MultiChoiceInputField from "../MultiChoiceInputField";
import CojAug22 from "./CojAug22";
import * as Yup from "yup";
import history from "../../navigation/history";
import ScrollTo from "../ScrollTo";
import { TraineeProfileService } from "../../../services/TraineeProfileService";
import { AxiosResponse } from "axios";
import { ProgrammeMembership } from "../../../models/ProgrammeMembership";

const CojView: React.FC = () => {
  const progName = store.getState().user.signingCojProgName;
  useEffect(() => {
    return () => {
      store.dispatch(updatedsigningCojProgName(null));
    };
  }, []);

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
          declareResponsibility: "",
          declareEmployment: ""
        }}
        validationSchema={Yup.object({
          declareResponsibility: Yup.string().required(
            "Please confirm your acceptance"
          ),
          declareEmployment: Yup.string().required(
            "Please confirm your acceptance"
          )
        })}
        onSubmit={async _values => {
          const traineeProfileService = new TraineeProfileService();
          const response: AxiosResponse<ProgrammeMembership> =
            await traineeProfileService.signCoj(
              store.getState().user.signingCojPmId
            );
          store.dispatch(updatedSignedCoj(response.data.conditionsOfJoining));
          history.push("/programmes");
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <>
            <MultiChoiceInputField
              id="declareResponsibility"
              type="checkbox"
              name="declareResponsibility"
              items={[
                {
                  label: `I acknowledge the importance of these responsibilities and understand that they are requirements for maintaining my registration with the Postgraduate Dean. If I fail to meet them, I understand that my training number/contract may be withdrawn by the Postgraduate Dean.`,
                  value: true
                }
              ]}
            />
            <MultiChoiceInputField
              id="declareEmployment"
              type="checkbox"
              name="declareEmployment"
              items={[
                {
                  label:
                    "I understand that this document does not constitute an offer of employment.",
                  value: true
                }
              ]}
            />
            <Button
              onClick={(e: { preventDefault: () => void }) => {
                e.preventDefault();
                handleSubmit();
              }}
              disabled={isSubmitting}
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
  return <CojAug22 progName={progName} />;
}
