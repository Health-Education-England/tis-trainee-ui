import { ActionLink, BackLink, Button, Col, Row } from "nhsuk-react-components";
import { FormRUtilities } from "../../utilities/FormRUtilities";

type IFormSave = {
  history: any;
  formrPath: string;
};

const FormSavePDF = ({ history, formrPath }: IFormSave) => {
  return (
    <div className="hide-from-print">
      <Row>
        <Col width="full">
          <BackLink
            style={{ cursor: "pointer", marginBottom: "1rem" }}
            data-cy="backLink"
            onClick={() => FormRUtilities.historyPush(history, formrPath)}
          >
            Go back to forms list
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
