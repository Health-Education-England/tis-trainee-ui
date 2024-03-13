type ErrorPageProps = {
  message: string;
  header: string;
};

export default function ErrorPage({
  message,
  header = "Oops! Something went wrong"
}: ErrorPageProps) {
  return (
    // TODO - add a button to return to previous page
    <>
      <div
        className="nhsuk-error-summary"
        aria-labelledby="error-summary-title"
        role="alert"
      >
        <h2 className="nhsuk-error-summary__title" id="error-summary-title">
          {header}
        </h2>
        <div className="nhsuk-error-summary__body">{message}</div>
      </div>
    </>
  );
}
