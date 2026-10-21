import { Button, ErrorSummary } from "nhsuk-react-components";

type CctCalculationErrorProps = {
  isRetrying: boolean;
  onRetry: () => void;
  message?: string;
};

export function CctCalculationError({
  isRetrying,
  onRetry,
  message = "We could not calculate your Completion of Training Date."
}: Readonly<CctCalculationErrorProps>) {
  return (
    <ErrorSummary disableAutoFocus data-cy="cct-calculation-error">
      <ErrorSummary.Title>Oops! Something went wrong</ErrorSummary.Title>
      <p>{message}</p>
      <Button
        secondary
        type="button"
        onClick={onRetry}
        data-cy="cct-calculation-retry"
      >
        {isRetrying ? "Trying again…" : "Try again"}
      </Button>
    </ErrorSummary>
  );
}
