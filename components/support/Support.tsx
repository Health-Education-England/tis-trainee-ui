import { ActionLink, Card, Fieldset } from "nhsuk-react-components";
import PageTitle from "../common/PageTitle";
import { useAppSelector } from "../../redux/hooks/hooks";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";
import ScrollTo from "../forms/ScrollTo";
import style from "../Common.module.scss";
import { getUserAgentInfo } from "../../utilities/UserUtilities";
import { LoSupport } from "./LoSupport";
import { TechSupport } from "./TechSupport";

const Support = () => {
  const { traineeTisId, personalDetails } =
    useAppSelector(selectTraineeProfile);
  const gmcNo = personalDetails?.gmcNumber;
  const emailIds = gmcNo
    ? `GMC no. ${gmcNo}, TIS ID ${traineeTisId}`
    : `TIS ID ${traineeTisId}`;
  const userAgentData = getUserAgentInfo();

  const content = (
    <>
      <PageTitle title="Support" />
      <ScrollTo />
      <Fieldset>
        <Fieldset.Legend
          isPageHeading
          className={style.fieldLegHeader}
          data-cy="supportHeading"
        >
          Support
        </Fieldset.Legend>
      </Fieldset>
      <Card feature data-cy="supportFaqs">
        <Card.Content>
          <Card.Heading data-cy="supportFaqsHeading">FAQ&apos;s</Card.Heading>
          <Fieldset.Legend
            data-cy="supportFaqsLegend"
            size="m"
            className="fieldset-legend__header"
          >
            Please read our FAQ&apos;s to see if your query can be answered
            there.
          </Fieldset.Legend>
          <ActionLink
            data-cy="supportFaqsLink"
            target="_blank"
            rel="noopener noreferrer"
            href="https://tis-support.hee.nhs.uk/trainees/support-faq/"
          >
            Click here to view FAQ&apos;s (opens a new window)
          </ActionLink>
        </Card.Content>
      </Card>
      <Card feature data-cy="loSupportLabel">
        <Card.Content>
          <Card.Heading data-cy="loSupportHeading">
            Local Office support
          </Card.Heading>
          <Fieldset.Legend
            data-cy="loSupportLegend"
            size="m"
            className="fieldset-legend__header"
          >
            Form R process & data quality issues
            <p data-cy="loSupportDesc">
              (e.g. Editing a submitted form, incorrect data.)
            </p>
          </Fieldset.Legend>
          <LoSupport emailIds={emailIds} userAgentData={userAgentData} />
        </Card.Content>
      </Card>
      <Card feature data-cy="techSupportLabel">
        <Card.Content>
          <Card.Heading data-cy="techSupportHeading">
            Technical support
          </Card.Heading>
          <Fieldset.Legend
            data-cy="techSupportLegend"
            size="m"
            className="fieldset-legend__header"
          >
            App-related technical issues
            <p data-cy="techSupportDesc">
              (e.g. Error messages, Form R not saving.)
            </p>
          </Fieldset.Legend>
          <TechSupport emailIds={emailIds} userAgentData={userAgentData} />
        </Card.Content>
      </Card>
    </>
  );
  return <div>{content}</div>;
};

export default Support;
