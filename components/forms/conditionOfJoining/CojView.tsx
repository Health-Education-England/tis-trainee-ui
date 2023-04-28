import { Formik } from "formik";
import { Button } from "nhsuk-react-components";
import { useEffect } from "react";
import { signCoj } from "../../../redux/slices/traineeProfileSlice";
import { updatedsigningCojProgName } from "../../../redux/slices/userSlice";
import store from "../../../redux/store/store";
import history from "../../navigation/history";
import ScrollTo from "../ScrollTo";
import CojGg9 from "./CojGg9";

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
        initialValues={{}}
        onSubmit={async _values => {
          const signingCojPmId = store.getState().user.signingCojPmId;
          await store.dispatch(signCoj(signingCojPmId));
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
