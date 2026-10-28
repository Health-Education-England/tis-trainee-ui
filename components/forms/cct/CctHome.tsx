import { Button } from "nhsuk-react-components";
import history from "../../navigation/history";

export function CctHome() {
  return (
    <Button
      type="button"
      onClick={() => history.push("/cct/create")}
      data-cy="cct-new-calculation"
    >
      Start a new calculation
    </Button>
  );
}
