import { WarningCallout } from "nhsuk-react-components";
import { Fragment } from "react";

type ImportantText = {
  txtName: string;
};

export const ImportantText = ({ txtName }: ImportantText) => {
  return (
    <WarningCallout>
      <WarningCallout.Label
        visuallyHiddenText={false}
        data-cy={`WarningCallout-${txtName}-label`}
      >
        Important
      </WarningCallout.Label>
      {displayText[txtName]}
    </WarningCallout>
  );
};

const prepopulatedText =
  "This form has been pre-populated using the information available against your records within the Trainee Information System (TIS). Please check all details and amend where necessary. Amendments made to your details on this form will not update other systems that you may have access to. By submitting this document you are confirming that ALL DETAILS (pre-populated or entered/amended by you) are correct.";

const yourResonsibilityText =
  "It remains your own responsibility to keep your Designated Body and the GMC informed as soon as possible of any changes to your contact details. Your HEE Local team remains your Designated Body throughout your time in training. You can update your Designated Body on your GMC Online account under 'My Revalidation'.";

const outcome5Text =
  "Failure to appropriately complete a Form R Part B when requested may result in an Outcome 5 at ARCP (Please refer to latest edition of the COPMed Gold Guide).";

const covid19Text1 =
  "Please complete this form with the information about your training since your last ARCP review, or this is the first scheduled ARCP in your programme, since the start of your current period of training.";
const covid19Text2 = "Please comment on:";
const covid19Text3 =
  "- Your self-assessment of progress up to the point of COVID 19.";
const covid19Text4 =
  "- How your training may have been impacted by COVID 19 e.g. if you have not been able to acquire required competencies/capabilities through lack of appropriate learning opportunities or cancellation of required exams/courses.";
const covid19Text5 = "- Any other relevant information.";
const covid19Text6 =
  "By submitting this document, you are confirming that ALL details are correct and that you have made an honest declaration in accordance with the professional standards set out by the General Medical Council in Good Medical Practice.";

const generateTextElement = (texts: string[]) => (
  <p>
    {texts.map(text => (
      <Fragment key={text}>
        {text}
        <br />
        <br />
      </Fragment>
    ))}
  </p>
);

type DisplayText = {
  [key: string]: JSX.Element;
};

const displayText: DisplayText = {
  FormAImportantNotice: generateTextElement([
    prepopulatedText,
    yourResonsibilityText
  ]),
  FormBImportantNotice: generateTextElement([
    prepopulatedText,
    yourResonsibilityText,
    outcome5Text
  ]),
  Covid19ImportantNotice: generateTextElement([
    covid19Text1,
    covid19Text2,
    covid19Text3,
    covid19Text4,
    covid19Text5,
    covid19Text6
  ])
};
