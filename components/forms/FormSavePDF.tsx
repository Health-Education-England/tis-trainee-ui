import { ActionLink, Button, Col, Row } from "nhsuk-react-components";
import { downloadCojPdf } from "../../utilities/FileUtilities";
import { useAppSelector } from "../../redux/hooks/hooks";
import { useState } from "react";
import FormBackLink from "../common/FormBackLink";

type IFormSave = {
  history: any;
  path: string;
  pmId: string;
};

const FormSavePDF = ({ history, path, pmId }: IFormSave) => {
  const [showPdfHelp, setShowPdfHelp] = useState<boolean>(false);
  const matchedPm = useAppSelector(state =>
    state.traineeProfile.traineeProfileData.programmeMemberships.find(
      pm => pm.tisId === pmId
    )
  );
  return (
    <div className="hide-from-print">
      <Row>
        <Col width="full">
          <FormBackLink history={history} path={path} />
        </Col>
      </Row>
      <Row>
        <Col width="one-third">
          <Button
            data-cy="savePdfBtn"
            onClick={() => {
              downloadCojPdf(pmId, matchedPm, setShowPdfHelp);
            }}
          >
            Save a copy as a PDF
          </Button>
        </Col>
        {showPdfHelp && (
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
        )}
      </Row>
    </div>
  );
};

export default FormSavePDF;
