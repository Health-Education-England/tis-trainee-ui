import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import type { SizeProp } from "@fortawesome/fontawesome-svg-core";

type FieldWarningMsg = {
  warningMsgs: string[];
  iconSize?: SizeProp;
  fontSize?: string;
};

const FieldWarningMsg = ({
  warningMsgs,
  iconSize = "lg",
  fontSize = "1rem"
}: FieldWarningMsg) => {
  if (!warningMsgs || warningMsgs.length === 0) return null;

  return (
    <>
      {warningMsgs.map((msg, i) => (
        <div key={i} className="field-warning-container">
          <span className="field-warning-icon">
            <FontAwesomeIcon icon={faTriangleExclamation} size={iconSize} />
          </span>
          <span className="field-warning-msg" style={{ fontSize }}>
            {msg}
          </span>
        </div>
      ))}
    </>
  );
};
export default FieldWarningMsg;
