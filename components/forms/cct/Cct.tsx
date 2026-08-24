import { Fieldset, Legend } from "nhsuk-react-components";
import style from "../../Common.module.scss";

export function Cct() {
  return (
    <>
      <Fieldset>
        <Legend
          isPageHeading
          className={style.fieldLegHeader}
          data-cy="cct-header"
          size="xl"
        >
          Certificate of Completion of Training (CCT)
        </Legend>
      </Fieldset>
      <p>CCT was here</p>
    </>
  );
}
