import PageTitle from "../common/PageTitle";
import { useAppSelector } from "../../redux/hooks/hooks";
import { Redirect } from "react-router-dom";
import SupportForm from "./SupportForm";

const Support = () => {
  const preferredMfa = useAppSelector(state => state.user.preferredMfa);

  if (preferredMfa === "NOMFA") {
    return <Redirect to="/mfa" />;
  }

  const content = (
    <>
      <PageTitle title="Support" />
      <h1 data-cy="pageTitle" style={{ marginBottom: 16, color: "#005EB8" }}>
        Support
      </h1>
      <SupportForm />
    </>
  );
  return <div>{content}</div>;
};

export default Support;
