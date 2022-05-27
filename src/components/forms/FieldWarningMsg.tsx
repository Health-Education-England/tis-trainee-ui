import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import "./FieldWarningMsg.scss";
interface IFieldWarningMsg {
  warningMsg: string;
}
const FieldWarningMsg = ({ warningMsg }: IFieldWarningMsg) => {
  return (
    <div className="field-warning-container">
      <span className="field-warning-icon">
        <FontAwesomeIcon icon={faTriangleExclamation} size="lg" />
      </span>
      <span className="field-warning-msg">{warningMsg}</span>
    </div>
  );
};
export default FieldWarningMsg;
