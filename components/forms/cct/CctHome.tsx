import { WarningCallout } from "nhsuk-react-components";
import { CctCalculatorLinks } from "./CctCalculatorLinks";

export function CctHome() {
  return (
    <WarningCallout data-cy="cct-home-warning">
      <WarningCallout.Heading>Important</WarningCallout.Heading>
      <p data-cy="cct-home-warning-text">
        A new CCT calculator is on its way to TIS Self-Service. Until then,
        please use a trusted NHS CCT calculator, such as one of those below.
      </p>
      <CctCalculatorLinks />
    </WarningCallout>
  );
}
