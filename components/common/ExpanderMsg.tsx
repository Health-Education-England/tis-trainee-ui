import { ActionLink, Details } from "nhsuk-react-components";
import { Link } from "react-router-dom";
import { tier2SkilledWorkerVisaInfo } from "../../utilities/Constants";

export type ExpanderNameType =
  | "dataSource"
  | "formRDeclarationsExplained"
  | "postTypes"
  | "cctInfo"
  | "skilledVisaWorker"
  | "skilledVisaWorkerMoreInfo"
  | "whatIsLtft"
  | "preApproverInfo"
  | "ltft16WeeksNotice";

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
    },
    postTypes: {
      summary: "Post Type or Appointment definitions",
      text: (
        <>
          <p>
            <b>Substantive post: </b>A role that a post graduate doctor in
            training holds on a permanent basis.
          </p>
          <p>
            <b>Military post: </b>Doctors undertaking their training in the
            Royal Navy Medical Service, Army Medical Service, the Royal Air
            Force Medical Service or the Headquarters Defence Medical Services
            (HQ DMS).
          </p>
        </>
      ),
      actionLinkText:
        "See the latest Gold Guide for more details (opens a new tab)",
      actionLinkHref:
        "https://www.copmed.org.uk/images/docs/goldguide10thedition/Gold%20Guide%2010th%20Edition%20August%202024.pdf"
    },
    cctInfo: {
      summary: "CCT Calculator further information",
      text: (
        <>
          <p>
            This CCT calculation is designed to give a rough estimate of the
            change in Programme end date based on a change in Whole Time
            Equivalent (WTE) percentage{" "}
            <i>
              <b>before</b>
            </i>{" "}
            the specifics of your working arrangments are discussed with your
            Training Programme Director (TPD).
          </p>
          <p>
            <b>Q. What is your current WTE percentage?</b>
          </p>
          <p>
            {`WTE (Whole Time Equivalent) is a measure of the proportion of full
            time hours you are currently working as a percentage. If your
            current percentage is not in the list you can add it by typing (e.g.
            40 or 40%) and then clicking 'Create' to select it.`}
          </p>
          <p>
            <b> Q. What WTE percentage(s) are you considering?</b>
          </p>
          <p>
            The WTE percentage(s) you select are subject to availability and
            agreement with your TPD.
          </p>
          <p>
            {`The dropdown lists the standard WTE percentages. You can add your
            own by typing and clicking 'Create' but this bespoke value might not
            be possible.`}
          </p>
          <p>
            Returning to full time (100% WTE) requires a full time vacancy to
            exist.
          </p>
          <p>Some specialties will not allow 50% WTE.</p>
          <p>
            <b>Q. When should the WTE change begin?</b>
          </p>
          <p>
            The required notice period is normally 16 weeks. Shorter notice
            periods may be possible but will need to be agreed.
          </p>
          <p>
            <b>Q. When should the WTE change end?</b>
          </p>
          <p>
            The default is the current programme end date but you can choose to
            end the change in WTE earlier.
          </p>
        </>
      )
    },
    skilledVisaWorker: {
      summary: "Are you a Skilled Worker visa holder?",
      text: tier2SkilledWorkerVisaInfo
    },
    skilledVisaWorkerMoreInfo: {
      summary: "More information for Skilled Worker visa holders",
      text: tier2SkilledWorkerVisaInfo
    },
    whatIsLtft: {
      summary:
        "What is Less than full-time (LTFT) training and how do I apply?",
      text: (
        <>
          <p>
            <strong>Less than full-time (LTFT) training</strong> is when a
            resident doctor such as yourself reduces their working hours below
            the standard 100% full-time (40 hrs per week) to a different
            percentage such as 60% or 80%.
          </p>
          <p>
            <strong>
              As a resident doctor you are welcome to apply for LTFT training:
            </strong>
          </p>
          <p>
            There are many reasons a resident doctor may choose to apply for
            LTFT training. Consideration is also given to the impact this will
            have on training pathway and expected CCT.
          </p>
          <ul>
            <li>
              <strong>If already in training</strong>, first discuss your
              proposals with your pre-approver, which is usually a training
              programme director, educational supervisor or GP programme
              manager. If you are unsure who your pre-approver is, please{" "}
              <Link to="/support">contact your Local Office support</Link>{" "}
            </li>
            <li>
              <strong>If not yet commenced training</strong>, and your programme
              is not listed, please{" "}
              <Link to="/support">contact your Local Office support</Link>{" "}
            </li>
          </ul>
          <p>
            <strong>When you are ready to apply for LTFT</strong>, please use
            the button below to make a new application.
          </p>
          <p>
            <i>
              Note: you can use the same LTFT application form to go less than
              full-time or increase your working hours percentage.
            </i>
          </p>
        </>
      ),
      actionLinkText:
        "See the latest Gold Guide for more details (opens a new tab)",
      actionLinkHref:
        "https://www.copmed.org.uk/images/docs/goldguide10thedition/Gold%20Guide%2010th%20Edition%20August%202024.pdf"
    },
    preApproverInfo: {
      summary: "What should I discuss with my pre-approver?",
      text: (
        <>
          <p>
            Before submitting your LTFT application, you must have a discussion
            with your Training Programme Director (TPD) or Primary Approver.
            This conversation ensures your request supports both your personal
            circumstances and your training progression.
          </p>
          <p>
            During this discussion, you should cover:
            <ul>
              <ul>
                <li>
                  Your reason(s) for requesting LTFT (e.g. caring
                  responsibilities, health, professional development,
                  wellbeing).
                </li>
                <li>
                  The proposed working pattern (e.g. 60%, 80% of your full-time
                  working hours, expected days per week).
                </li>
                <li>
                  Impact on training progression, pay changes and completion
                  dates.
                </li>
                <li>Planned start date and notice period.</li>
                <li>Any support or adjustments you may need.</li>
              </ul>
              <p>
                The purpose of this discussion is to ensure understanding and
                support within your training programme.
              </p>
            </ul>
          </p>
        </>
      )
    },
    ltft16WeeksNotice: {
      summary: "What is the 16 weeks notice period for LTFT?",
      text: (
        <>
          <p>
            <strong>16 weeks notice guidance</strong>
          </p>
          <ul>
            <li>
              <strong>Aim</strong> for a minimum of 16 weeks before your desired
              LTFT start date to allow for your application to be processed
              smoothly.
            </li>
            <li>
              <strong>The 16 weeks starts</strong> from the date your completed
              LTFT application (with Pre approver (TPD) agreement) is submitted
              on TIS Self-Service, and not from the date of any initial
              discussions.
            </li>
            <li>
              <strong>This allows time</strong> for your Educational Supervisor
              (ES), Training Programme Director (TPD), and the employing trust
              (including payroll/HR) to arrange new contracts, schedules, and
              funding.
            </li>
            <li>
              <strong>Late Applications</strong> may be declined or delayed,
              though exceptional circumstances (e.g. sudden disability,
              significant life changes) are reviewed on a case-by-case basis.
            </li>
            <li>
              <strong>Check with your region</strong> for any specific
              application windows and deadlines (e.g. September rotations) as
              these can vary slightly by region (Local Office) and training
              specialty.
            </li>
            <p>
              <Link to="/support">Contact your Local Office support</Link> for
              further details.
            </p>
          </ul>
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
