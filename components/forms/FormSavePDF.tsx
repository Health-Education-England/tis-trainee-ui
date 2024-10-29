import { ActionLink, BackLink, Button, Col, Row } from "nhsuk-react-components";
import { FormRUtilities } from "../../utilities/FormRUtilities";
import style from "../Common.module.scss";

type IFormSave = {
  history: any;
  path: string;
  onClickHandler?: any;
};

const FormSavePDF = ({ history, path, onClickHandler }: IFormSave) => {
  return (
    <div className="hide-from-print">
      <Row>
        <Col width="full">
          <BackLink
            className={style.backLink}
            data-cy="backLink"
            onClick={() => FormRUtilities.historyPush(history, path)}
          >
            Back to forms list
          </BackLink>
        </Col>
      </Row>
      <Row>
        <Col width="one-third">
          <Button
            data-cy="savePdfBtn"
            onClick={onClickHandler || (() => FormRUtilities.windowPrint())}
          >
            Save a copy as a PDF
          </Button>
        </Col>
        <Col style={{ textAlign: "right" }} width="two-thirds">
          {onClickHandler ? (
            <></>
          ) : (
            <ActionLink
              data-cy="pdfHelpLink"
              target="_blank"
              rel="noopener noreferrer"
              href="https://tis-support.hee.nhs.uk/trainees/how-to-save-form-as-pdf/"
            >
              Click here for help saving form as a PDF
            </ActionLink>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default FormSavePDF;
