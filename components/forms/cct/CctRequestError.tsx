import { Button, ErrorSummary } from "nhsuk-react-components";

type CctRequestErrorProps = {
  isRetrying: boolean;
  onRetry: () => void;
  message?: string;
};

export function CctRequestError({
  isRetrying,
  onRetry,
  message = "We could not calculate your Completion of Training Date."
}: Readonly<CctRequestErrorProps>) {
  return (
    <ErrorSummary disableAutoFocus data-cy="cct-request-error">
      <ErrorSummary.Title>Oops! Something went wrong</ErrorSummary.Title>
      <p>{message}</p>
      <Button
        secondary
        type="button"
        onClick={onRetry}
        data-cy="cct-request-retry"
      >
        {isRetrying ? "Trying again…" : "Try again"}
      </Button>
    </ErrorSummary>
  );
}
