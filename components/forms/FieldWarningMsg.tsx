import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import type { SizeProp } from "@fortawesome/fontawesome-svg-core";
interface IFieldWarningMsg {
  warningMsg: string | undefined;
  iconSize?: SizeProp;
  fontSize?: string;
}
const FieldWarningMsg = ({
  warningMsg,
  iconSize = "lg",
  fontSize = "1rem"
}: IFieldWarningMsg) => {
  return (
    <div className="field-warning-container">
      <span className="field-warning-icon">
        <FontAwesomeIcon icon={faTriangleExclamation} size={iconSize} />
      </span>
      <span className="field-warning-msg" style={{ fontSize }}>
        {warningMsg}
      </span>
    </div>
  );
};
export default FieldWarningMsg;
