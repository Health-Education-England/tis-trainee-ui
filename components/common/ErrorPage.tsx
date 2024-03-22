type ErrorPageProps = {
  message: string;
  header?: string;
};

export default function ErrorPage({
  message,
  header = "Oops! Something went wrong"
}: Readonly<ErrorPageProps>) {
  return (
    <div
      className="nhsuk-error-summary"
      aria-labelledby="error-summary-title"
      role="alert"
    >
      <h2
        className="nhsuk-error-summary__title"
        id="error-summary-title"
        data-cy="error-header-text"
      >
        {header}
      </h2>
      <div className="nhsuk-error-summary__body" data-cy="error-message-text">
        {message}
      </div>
    </div>
  );
}
