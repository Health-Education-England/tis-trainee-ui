const CredentialInvalid: React.FC = () => {
  const queryParams = new URLSearchParams(location.search);
  const stateParam = queryParams?.get("state");
  const reasonParam = queryParams?.get("reason");
  const errText =
    "If problem persists then please contact Support (Technical issues).";
  let content;

  if (stateParam && reasonParam) {
    localStorage.removeItem("verification");
    localStorage.removeItem(stateParam);
    content = (
      <>
        <p>{`Reason: ${reasonParam.replaceAll("_", " ")}.`}</p>
        <p>{errText}</p>
      </>
    );
  } else {
    localStorage.removeItem("verification");
    content = (
      <>
        <p>{`Invalid credential.`} </p>
        <p>{errText}</p>
      </>
    );
  }

  return (
    <div
      className="nhsuk-error-summary"
      aria-labelledby="error-summary-title"
      role="alert"
    >
      <h2 className="nhsuk-error-summary__title" id="error-summary-title">
        Something went wrong
      </h2>
      <div className="nhsuk-error-summary__body">{content}</div>
    </div>
  );
};

export default CredentialInvalid;
