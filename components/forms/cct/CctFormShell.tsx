import React from "react";
import { BackLink, Button } from "nhsuk-react-components";

type CctFormShellProps = {
  pageNames: string[];
  currentPage: number;
  canGoNext: boolean;
  canReturnToSummary: boolean;
  onNavigate: (targetPage: number) => void;
  onBackToHome: () => void;
  children: React.ReactNode;
};

export function CctFormShell({
  pageNames,
  currentPage,
  canGoNext,
  canReturnToSummary,
  onNavigate,
  onBackToHome,
  children
}: Readonly<CctFormShellProps>) {
  const lastPage = pageNames.length - 1;
  const isBackToHome = currentPage === 0 || currentPage === lastPage;

  return (
    <>
      <BackLink
        asElement="button"
        type="button"
        className="nhsuk-u-margin-bottom-7"
        onClick={() =>
          isBackToHome ? onBackToHome() : onNavigate(currentPage - 1)
        }
        data-cy="cct-back-link"
      >
        {isBackToHome
          ? "Back to CCT home"
          : `Back to ${pageNames[currentPage - 1]}`}
      </BackLink>
      <div data-cy="progress-header">
        <h3 className="hide-from-print">
          {`Step ${currentPage + 1} of ${pageNames.length} - ${
            pageNames[currentPage]
          }`}
        </h3>
        {children}
      </div>
      {currentPage < lastPage && canGoNext && (
        <div className="nhsuk-button-group hide-from-print">
          <Button
            type="button"
            onClick={() => onNavigate(currentPage + 1)}
            data-cy="cct-continue"
          >
            {currentPage === lastPage - 1 ? "Show summary" : "Continue"}
          </Button>
          {canReturnToSummary && currentPage < lastPage - 1 && (
            <Button
              secondary
              type="button"
              onClick={() => onNavigate(lastPage)}
              data-cy="cct-return-to-summary"
            >
              Return to summary
            </Button>
          )}
        </div>
      )}
    </>
  );
}
