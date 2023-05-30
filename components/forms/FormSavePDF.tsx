import { ActionLink, BackLink, Button, Col, Row } from "nhsuk-react-components";
import { FormRUtilities } from "../../utilities/FormRUtilities";
import style from "../Common.module.scss";

type IFormSave = {
  history: any;
  path: string;
};

const FormSavePDF = ({ history, path }: IFormSave) => {
  return (
    <div className="hide-from-print">
      <Row>
        <Col width="full">
          <BackLink
            className={style.backLink}
            data-cy="backLink"
            onClick={() => FormRUtilities.historyPush(history, path)}
          >
            Go back
          </BackLink>
        </Col>
      </Row>
      <Row>
        <Col width="one-third">
          <Button
            data-cy="savePdfBtn"
            onClick={() => FormRUtilities.windowPrint()}
          >
            Save a copy as a PDF
          </Button>
        </Col>
        <Col style={{ textAlign: "right" }} width="two-thirds">
          <ActionLink
            data-cy="pdfHelpLink"
            target="_blank"
            rel="noopener noreferrer"
            href="https://tis-support.hee.nhs.uk/trainees/how-to-save-form-as-pdf/"
          >
            Click here for help saving form as a PDF
          </ActionLink>
        </Col>
      </Row>
    </div>
  );
};

export default FormSavePDF;
