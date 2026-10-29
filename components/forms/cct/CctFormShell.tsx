import React from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "nhsuk-react-components";
import { Link } from "react-router-dom";

type CctFormShellProps = {
  pageNames: string[];
  currentPage: number;
  canGoNext: boolean;
  onNavigate: (targetPage: number) => void;
  children: React.ReactNode;
};

// Note: the progress header and pagination are copied from FormBuilder so the calculator reads like the other forms. Put them in a shared component if a third form needs them.
export function CctFormShell({
  pageNames,
  currentPage,
  canGoNext,
  onNavigate,
  children
}: Readonly<CctFormShellProps>) {
  const lastPage = pageNames.length - 1;

  return (
    <>
      <div data-cy="progress-header">
        <h3 className="hide-from-print">
          {`Part ${currentPage + 1} of ${pageNames.length} - ${
            pageNames[currentPage]
          }`}
        </h3>
        {children}
      </div>
      <nav className="nhsuk-pagination">
        <ul className="nhsuk-list nhsuk-pagination__list">
          <li className="nhsuk-pagination-item--previous">
            {currentPage > 0 && (
              <Link
                to="#"
                className="nhsuk-pagination__link nhsuk-pagination__link--prev"
                onClick={() => onNavigate(currentPage - 1)}
                data-cy="navPrevious"
              >
                <span className="nhsuk-pagination__title">Previous</span>
                <span className="nhsuk-u-visually-hidden">:</span>
                <span className="nhsuk-pagination__page">
                  <div>{`${currentPage}. ${pageNames[currentPage - 1]}`}</div>
                </span>
                <ArrowLeftIcon />
              </Link>
            )}
          </li>
          <li className="nhsuk-pagination-item--next">
            {currentPage < lastPage && canGoNext && (
              <Link
                to="#"
                className="nhsuk-pagination__link nhsuk-pagination__link--next"
                onClick={() => onNavigate(currentPage + 1)}
                data-cy="navNext"
              >
                <span className="nhsuk-pagination__title">Next</span>
                <span className="nhsuk-u-visually-hidden">:</span>
                <span className="nhsuk-pagination__page">
                  <div>{`${currentPage + 2}. ${
                    pageNames[currentPage + 1]
                  }`}</div>
                </span>
                <ArrowRightIcon />
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
}
