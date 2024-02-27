import { Checkboxes } from "nhsuk-react-components";
import { Form } from "./FormBuilder";
import { useEffect, useMemo, useState } from "react";

type DeclarationsProps = {
  setCanSubmit: (canSubmit: boolean) => void;
  canEdit: boolean;
  formJson: Form;
};

export default function Declarations({
  setCanSubmit,
  canEdit,
  formJson
}: Readonly<DeclarationsProps>) {
  const initialDecValues = useMemo(() => {
    return formJson.declarations.reduce((values, declaration) => {
      values[declaration.name] = false;
      return values;
    }, {} as Record<string, boolean>);
  }, [formJson.declarations]);

  const [decValues, setDecValues] =
    useState<Record<string, boolean>>(initialDecValues);
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setDecValues({
      ...decValues,
      [name]: checked
    });
  };

  useEffect(() => {
    setCanSubmit(Object.values(decValues).every(v => v));
  }, [decValues, setCanSubmit]);

  return (
    <Checkboxes>
      {formJson.declarations.map(declaration => (
        <Checkboxes.Box
          key={declaration.name}
          data-cy={declaration.name}
          name={declaration.name}
          checked={canEdit ? decValues[declaration.name] : true}
          onChange={handleCheckboxChange}
          readOnly={!canEdit}
        >
          {declaration.label}
        </Checkboxes.Box>
      ))}
    </Checkboxes>
  );
}
