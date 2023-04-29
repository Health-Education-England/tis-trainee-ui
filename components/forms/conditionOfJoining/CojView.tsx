import { Formik } from "formik";
import { Button } from "nhsuk-react-components";
import { signCoj } from "../../../redux/slices/traineeProfileSlice";
import store from "../../../redux/store/store";
import history from "../../navigation/history";
import ScrollTo from "../ScrollTo";
import CojGg9 from "./CojGg9";
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
        initialValues={{}}
        onSubmit={async _values => {
          const signingCojPmId = store.getState().user.signingCojPmId;
          await store.dispatch(signCoj(signingCojPmId));
          store.dispatch(updatedsigningCoj(false));
          history.push("/programmes");
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <>
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
  return <CojGg9 progName={progName} />;
}
