import { InsetText } from "nhsuk-react-components";
import { computedValueGenerators } from "../../../../utilities/FormBuilderUtilities";
import { ComputedValueName } from "../FormBuilder";
import { DateUtilities } from "../../../../utilities/DateUtilities";

type InfoTextProps = {
  name: string;
  label?: string;
  computedValue?: ComputedValueName;
};

// Note: info text only (no input). Any "{value}" token in the label is replaced with the field's computed value (dates are shown as local dates).
export const InfoText = ({ name, label, computedValue }: InfoTextProps) => {
  const generatedValue = computedValue
    ? computedValueGenerators[computedValue]()
    : null;
  const displayValue = generatedValue
    ? DateUtilities.ToLocalDate(generatedValue)
    : "";
  const [before, after] = (label ?? "").split("{value}");
  return (
    <InsetText data-cy={`${name}-info`}>
      <p>
        {before}
        {after !== undefined && (
          <>
            <strong>{displayValue}</strong>
            {after}
          </>
        )}
      </p>
    </InsetText>
  );
};
