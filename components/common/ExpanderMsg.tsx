import { ActionLink, Details } from "nhsuk-react-components";

export type ExpanderNameType = "dataSource" | "formRDeclarationsExplained";

export const ExpanderMsg = ({
  expanderName
}: {
  expanderName: ExpanderNameType;
}) => {
  const info: Record<
    ExpanderNameType,
    {
      summary: string;
      text: JSX.Element;
      actionLinkText?: string;
      actionLinkHref?: string;
    }
  > = {
    dataSource: {
      summary: "My details are wrong. How do I update them?",
      text: (
        <>
          <p>
            During the course of your training programme, you will most likely
            move between Trusts and/or employers several times, each time
            providing updated information about yourself. For this reason, on
            TIS Self-Service we display the most up-to-date information you have
            provided to your most recent Trust or employer.
          </p>
          <p>
            If you do find any inaccuracies, we ask you to update them with your
            Trust/employer or ESR where applicable to ensure both us and your
            Trust/employer have matching, accurate information.
          </p>
          <p>
            Please click on the link below for a list of where an item of
            personal data is maintained and how to update it.
          </p>
        </>
      ),
      actionLinkText: "How to update my personal details",
      actionLinkHref:
        "https://tis-support.hee.nhs.uk/trainees/how-to-update-personal-data/"
    },
    formRDeclarationsExplained: {
      summary: "Declaration types explained",
      text: (
        <>
          <p>
            <b>Significant Event:</b> The GMC states that a significant event
            (also known as an untoward or critical incident) is any unintended
            or unexpected event, which could or did lead to harm of one or more
            patients. This includes incidents which did not cause harm but could
            have done, or where the event should have been prevented. All
            doctors as part of revalidation are required to record and reflect
            on Significant events in their work with the focus on what you have
            learnt as a result of those event/s. Use non-identifiable patient
            data only.
          </p>
          <p>
            <b>Complaints:</b> A complaint is a formal expression of
            dissatisfaction or grievance. It can be about an individual doctor,
            the team or about the care of patients where a doctor could be
            expected to have had influence or responsibility. As a matter of
            honesty & integrity you are obliged to include all complaints, even
            when you are the only person aware of them. All doctors should
            reflect on how complaints influence their practice. Use
            non-identifiable patient data only.
          </p>
          <p>
            <b>Other investigations:</b> Any on-going investigations, such as
            honesty, integrity, conduct, or any other matters that you feel the
            ARCP panel or Responsible Officer should be made aware of. Use
            non-identifiable patient data only.
          </p>
        </>
      )
    }
  };

  return info[expanderName]?.text ? (
    <Details>
      <Details.Summary data-cy={`${expanderName}Summary`}>
        {info[expanderName].summary}
      </Details.Summary>
      <Details.Text data-cy={`${expanderName}Text`}>
        {info[expanderName].text}
      </Details.Text>
      {info[expanderName].actionLinkText && (
        <ActionLink
          data-cy="dataSourceLink"
          target="_blank"
          rel="noopener noreferrer"
          href={info[expanderName].actionLinkHref}
        >
          {info[expanderName].actionLinkText}
        </ActionLink>
      )}
    </Details>
  ) : null;
};
