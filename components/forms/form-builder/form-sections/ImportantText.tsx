import { WarningCallout } from "nhsuk-react-components";

interface ImportantText {
  txtName: string;
}

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

interface DisplayText {
  [key: string]: JSX.Element;
}

const displayText: DisplayText = {
  FormAImportantNotice: (
    <p>
      This form has been pre-populated using the information available against
      your records within the Trainee Information System (TIS). Please check all
      details and amend where necessary. Amendments made to your details on this
      form will not update other systems that you may have access to. By
      submitting this document you are confirming that ALL DETAILS
      (pre-populated or entered/amended by you) are correct. <br />
      <br />
      It remains your own responsibility to keep your Designated Body and the
      GMC informed as soon as possible of any changes to your contact details.
      Your HEE Local team remains your Designated Body throughout your time in
      training. You can update your Designated Body on your GMC Online account
      under &#34;My Revalidation&#34;.
    </p>
  ),
  FormBImportantNotice: (
    <p>
      This form has been pre-populated using the information available against
      your records within the Trainee Information System (TIS). Please check all
      details and amend where necessary. Amendments made to your details on this
      form will not update other systems that you may have access to. By
      submitting this document you are confirming that ALL DETAILS
      (pre-populated or entered/amended by you) are correct.
      <br />
      <br /> It remains your own responsibility to keep your Designated Body and
      the GMC informed as soon as possible of any changes to your contact
      details. Your HEE Local team remains your Designated Body throughout your
      time in training. You can update your Designated Body on your GMC Online
      account under &#34;My Revalidation&#34;.
      <br />
      <br /> Failure to appropriately complete a Form R Part B when requested
      may result in an Outcome 5 at ARCP{" "}
      <b>(Please refer to latest edition of the Gold Guide)</b>.
    </p>
  )
};
