import { WarningCallout } from "nhsuk-react-components";

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
  "This form has been pre-populated using the information available against your records within the Trainee Information System (TIS). Please check all details and amend where necessary. Amendments made to your details on this form will not automatically update other systems that you may have access to. By submitting this document you are confirming that ALL DETAILS (pre-populated or entered/amended by you) are correct.";

const yourResonsibilityText =
  "It remains your own responsibility to keep your Designated Body and the GMC informed as soon as possible of any changes to your contact details. Your Local Deanery team remains your Designated Body throughout your time in training. You can update your Designated Body on your GMC Online account under 'My Revalidation'.";

const outcome5Text =
  "Failure to appropriately complete a Form R Part B when requested may result in an Outcome 5 at ARCP (Please refer to latest edition of the COPMed Gold Guide).";

const covid19Text1 =
  "Please complete this form with the information about your training since your last ARCP review, or if this is the first scheduled ARCP in your programme, since the start of your current period of training.";
const covid19Text2 = "Please comment on:";
const covid19Text3 =
  "- Your self-assessment of progress up to the point of COVID 19.";
const covid19Text4 =
  "- How your training may have been impacted by COVID 19 e.g. if you have not been able to acquire required competencies/capabilities through lack of appropriate learning opportunities or cancellation of required exams/courses.";
const covid19Text5 = "- Any other relevant information.";
const covid19Text6 =
  "By submitting this document, you are confirming that ALL details are correct and that you have made an honest declaration in accordance with the professional standards set out by the General Medical Council in Good Medical Practice.";

const workInstructionsText1 =
  "Please list all Work placements in your capacity as a registered medical practitioner since your last ARCP (or since initial registration to a programme if more recent).";
const workInstructionsText2 =
  "This includes: (1) each of your training posts if you are or were in a training programme; (2) any time out of programme e.g. OOP, mat leave, career break, etc.; (3) any voluntary or advisory work, work in non-NHS bodies, or self-employment; (4) any work as a locum.";
const workInstructionsText3 =
  "For locum work, please group shifts with one employer within an unbroken period as one employer entry. Include the dates and number of shifts worked in each locum employer entry.";
const workInstructionsText4 =
  "If applicable, only your next upcoming placement is listed below. It is not necessary to include any future placements beyond that.";
const workInstructionsText5 =
  "Please add more Work placements if required using the 'Add a Work panel' button below.";
const workInstructionsText6 =
  "NOTE - Work placements will be sorted in a descending order by End Date when your form is reviewed and saved so there is no need to order them on this page.";

const tootInstructionsText1 =
  "Time Out Of Training (TOOT) is self-reported absence during a training programme since your last ARCP (or, if no ARCP, since initial registration to your programme).";
const tootInstructionsText2 =
  "TOOT days are days absent from your training programme and are considered by the ARCP panel/Deanery in recalculating the date your current training should end.";
const tootInstructionsText3 =
  "Please enter 0 (zero) where you have no days against a TOOT category.";
const tootInstructionsText4 =
  "Partial days should be rounded up to the nearest whole day.";

const gmpDeclarationsText1 =
  "These declarations are compulsory and relate to the Good Medical Practice guidance issued by the GMC.";

const gmpDeclarationsText2 =
  "Honesty & Integrity are at the heart of medical professionalism. This means being honest and trustworthy and acting with integrity in all areas of your practice and is covered in Good Medical Practice.";
const gmpDeclarationsText3 =
  "A statement of health is a declaration that you accept the professional obligations placed on you in Good Medical Practice about your personal health. Doctors must not allow their own health to endanger patients. Health is covered in Good Medical Practice.";

const previousResolvedDecsText1 =
  "This part is for RESOLVED declarations that were PREVIOUSLY DECLARED on your Form R Part B.";
const previousResolvedDecsText2 =
  "If you have updates on PREVIOUS declarations that are still UNRESOLVED, please do so in Part 7.";
const previousResolvedDecsText3 =
  "If you have any NEW declarations to make, please do so in Parts 8 & 9.";

const previousUnresolvedDecsText2 =
  "If you have any NEW declarations to make, please do so in Parts 8 & 9.";

const newResolvedDecsText1 =
  "This part is for NEW declarations NOT declared on your previous Form R Part B that have been RESOLVED.";
const newResolvedDecsText2 =
  "Details of NEW UNRESOLVED declarations are recorded in Part 9.";
const newResolvedDecsText3 =
  "PREVIOUS declarations declared on your last Form R Part B are recorded in Parts 6 & 7.";
const newResolvedDecsText4 =
  "If you know of any RESOLVED significant events/complaints/other investigations since your last ARCP/RITA/Appraisal, you are required to have written a reflection on these in your Portfolio. When completing a declaration below, please identify where in your Portfolio the reflection(s) can be found.";
const newResolvedDecsText5 =
  "Please DO NOT include any patient-identifiable information on this form.";

const unresolvedDecsText =
  "If you know of any UNRESOLVED Significant Events, Complaints, Other investigations since your last ARCP/RITA/Appraisal, please provide a brief summary, including where you were working, the date of the event, and your reflection where appropriate. If known, please identify what investigations are pending relating to the event and which organisation is undertaking the investigation.";

const ltftDiscussionText1 =
  "Please provide the contact details of the Training Programme Director (TPD) you have discussed your Changing hours (LTFT) proposals with prior to completing this form. ";

const ltftDiscussionText2 =
  "When you submit this appication, your TPD will receive an email which will include a summary of your proposals.";

const ltftOtherDiscussionsText =
  "If applicable, please provide details of any other discussions you have had concerning your Changing hours (LTFT) proposals.";

const ltftReasonsText1 =
  "Please provide the reason for your Changing hours (LTFT) request. If you have more than one reason, please select multiple reason.";

const ltftReasonsText2 =
  "If your reason isn't in the list then please select 'other reason' and provide details in the space provided.";

const generateTextElement = (texts: string[]) => (
  <span>
    {texts.map(text => (
      <p key={text}>{text}</p>
    ))}
  </span>
);

type DisplayText = {
  [key: string]: JSX.Element;
};

const displayText: DisplayText = {
  formAImportantNotice: generateTextElement([
    prepopulatedText,
    yourResonsibilityText
  ]),
  formBImportantNotice: generateTextElement([
    prepopulatedText,
    yourResonsibilityText,
    outcome5Text
  ]),
  covid19ImportantNotice: generateTextElement([
    covid19Text1,
    covid19Text2,
    covid19Text3,
    covid19Text4,
    covid19Text5,
    covid19Text6
  ]),
  workInstructions: generateTextElement([
    workInstructionsText1,
    workInstructionsText2,
    workInstructionsText3,
    workInstructionsText4,
    workInstructionsText5,
    workInstructionsText6
  ]),
  tootInstructions: generateTextElement([
    tootInstructionsText1,
    tootInstructionsText2,
    tootInstructionsText3,
    tootInstructionsText4
  ]),
  gmpDeclarationsInstructions: generateTextElement([
    gmpDeclarationsText1,
    gmpDeclarationsText2,
    gmpDeclarationsText3
  ]),
  previousResolvedDecsInstructions: generateTextElement([
    previousResolvedDecsText1,
    previousResolvedDecsText2,
    previousResolvedDecsText3
  ]),
  previousUnresolvedDecsInstructions: generateTextElement([
    unresolvedDecsText,
    previousUnresolvedDecsText2
  ]),
  newResolvedDecsInstructions: generateTextElement([
    newResolvedDecsText1,
    newResolvedDecsText2,
    newResolvedDecsText3,
    newResolvedDecsText4,
    newResolvedDecsText5
  ]),
  newUnresolvedDecsInstructions: generateTextElement([unresolvedDecsText]),
  ltftDiscussionInstructions: generateTextElement([
    ltftDiscussionText1,
    ltftDiscussionText2,
    ltftOtherDiscussionsText
  ])
};
