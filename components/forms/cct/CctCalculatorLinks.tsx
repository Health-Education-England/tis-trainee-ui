import { ActionLink } from "nhsuk-react-components";

export function CctCalculatorLinks() {
  return (
    <>
      <ActionLink
        href="https://rcem.ac.uk/cct-recalculations/"
        target="_blank"
        rel="noopener"
      >
        Go to Royal College of Emergency Medicine (RCEM) CCT Calculator website
      </ActionLink>
      <ActionLink
        href="https://rcoa.ac.uk/cct-date-calculator"
        target="_blank"
        rel="noopener"
      >
        Go to Royal College of Anaesthetists (RCoA) CCT Calculator website
      </ActionLink>
    </>
  );
}
