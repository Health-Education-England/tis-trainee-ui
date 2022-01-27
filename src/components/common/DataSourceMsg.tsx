import { ActionLink, Details } from "nhsuk-react-components";

const DataSourceMsg = () => {
  return (
    <Details>
      <Details.Summary data-cy="dataSourceSummary">
        My details are wrong. How do I update them?
      </Details.Summary>
      <Details.Text data-cy="dataSourceText">
        <p>
          Your details are mastered in several locations before being copied
          across to Trainee Self-Service. Depending on what details need
          changing, you might need to visit another website (e.g. ESR) or ask
          your Local Office/Trust to update them.
        </p>
        <p>
          Please click on the 'My data sources' link below for a list of where
          your details are mastered and how to update them.
        </p>
        <ActionLink
          data-cy="dataSourceLink"
          target="_blank"
          rel="noopener noreferrer"
          href="https://tis-support.hee.nhs.uk/"
        >
          My data sources
        </ActionLink>
      </Details.Text>
    </Details>
  );
};

export default DataSourceMsg;
