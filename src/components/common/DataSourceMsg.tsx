import { ActionLink, Details } from "nhsuk-react-components";

const DataSourceMsg = () => {
  return (
    <Details>
      <Details.Summary data-cy="dataSourceSummary">
        My details are wrong. How do I update them?
      </Details.Summary>
      <Details.Text data-cy="dataSourceText">
        <p>
          During the course of your training programme, you will most likely
          move between Trusts and/or employers several times, each time
          providing updated information about yourself. For this reason, on TIS
          Self-Service we display the most up-to-date information you have
          provided to your most recent Trust or employer.
        </p>
        <p>
          If you do find any inaccuracies, we ask you to update them with your
          Trust/employer or ESR where applicable to ensure both us and your
          Trust/employer have matching, accurate information.
        </p>
        <p>
          Please click on the link below for a list of where an item of personal
          data is maintained and how to update it.
        </p>
        <ActionLink
          data-cy="dataSourceLink"
          target="_blank"
          rel="noopener noreferrer"
          href="https://tis-support.hee.nhs.uk/trainees/how-to-update-personal-data/"
        >
          How to update my personal details
        </ActionLink>
      </Details.Text>
    </Details>
  );
};

export default DataSourceMsg;
