import { Checkboxes } from "nhsuk-react-components";
import { useEffect, useMemo, useState } from "react";
import { FormDeclaration } from "./form-builder/FormBuilder";

type DeclarationsProps = {
  setCanSubmit: (canSubmit: boolean) => void;
  canEdit: boolean;
  formDeclarations: FormDeclaration[];
};

export default function Declarations({
  setCanSubmit,
  canEdit,
  formDeclarations
}: Readonly<DeclarationsProps>) {
  const initialDecValues = useMemo(() => {
    return formDeclarations.reduce((values, declaration) => {
      values[declaration.name] = false;
      return values;
    }, {} as Record<string, boolean>);
  }, [formDeclarations]);

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
      {formDeclarations.map(declaration => (
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
