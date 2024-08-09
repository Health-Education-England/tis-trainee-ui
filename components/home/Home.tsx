import { Card, Fieldset } from "nhsuk-react-components";
import { Redirect } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks/hooks";
import history from "../navigation/history";
import style from "../Common.module.scss";

const handleClick = (route: string) => history.push(route);

interface HomeCardProps {
  isClickable: boolean;
  route: string;
  linkHeader: string;
  children: any;
}

const Home = () => {
  const preferredMfa = useAppSelector(state => state.user.preferredMfa);

  if (preferredMfa === "NOMFA") {
    return <Redirect to="/mfa" />;
  }
  return (
    <div className="nhsuk-width-container nhsuk-u-margin-top-5">
      <Fieldset.Legend size="m">TIS Self-Service overview</Fieldset.Legend>
      <Card.Group>
        <Card.GroupItem width="one-third">
          <PageCard
            isClickable={true}
            route="/action-summary"
            linkHeader="Action Summary"
          >
            <ul className={style.ull}>
              <li>Outstanding tasks to complete</li>
              <li>Status of FormR submissions</li>
            </ul>
          </PageCard>
        </Card.GroupItem>
        <Card.GroupItem width="one-third">
          <PageCard
            isClickable={true}
            route="/programmes"
            linkHeader="Programmes"
          >
            <ul className={style.ull}>
              <li>Training Number (NTN/DRN)</li>
              <li>Conditions of Joining (CoJ) Agreement(s)</li>
              <li>CCT Calculator</li>
              <li>Issuing a Digital Staff Passport (DSP) credential</li>
              <li>Programmes (past, current and future)</li>
            </ul>
          </PageCard>
        </Card.GroupItem>
        <Card.GroupItem width="one-third">
          <PageCard
            isClickable={true}
            route="/placements"
            linkHeader="Placements"
          >
            <ul className={style.ull}>
              <li>Issuing a Digital Staff Passport (DSP) credential</li>
              <li>Placements (past, current and future)</li>
            </ul>
          </PageCard>
        </Card.GroupItem>
      </Card.Group>
      <Card.Group>
        <Card.GroupItem width="one-third">
          <PageCard
            isClickable={true}
            route="/formr-a"
            linkHeader="Form R (Part A)"
          >
            <ul className={style.ull}>
              <li>Submit a new form</li>
              <li>View and save a PDF copy of a submitted form</li>
            </ul>
          </PageCard>
        </Card.GroupItem>
        <Card.GroupItem width="one-third">
          <PageCard
            isClickable={true}
            route="/formr-b"
            linkHeader="Form R (Part B)"
          >
            <ul className={style.ull}>
              <li>Submit a new form</li>
              <li>View and save a PDF copy of a submitted form</li>
            </ul>
          </PageCard>
        </Card.GroupItem>
        <Card.GroupItem width="one-third">
          <PageCard isClickable={true} route="/profile" linkHeader="Profile">
            <ul className={style.ull}>
              <li>Personal information</li>
              <li>Registration details</li>
            </ul>
          </PageCard>
        </Card.GroupItem>
      </Card.Group>
      <Card.Group>
        <Card.GroupItem width="one-third">
          <PageCard isClickable={true} route="/support" linkHeader="Support">
            <ul className={style.ull}>
              <li>
                Email your Local Office with Form R and Personal details queries
              </li>
              <li>
                Email TIS Support with any technical issues (e.g. error
                messages)
              </li>
            </ul>
          </PageCard>
        </Card.GroupItem>
        <Card.GroupItem width="one-third">
          <PageCard isClickable={true} route="/mfa" linkHeader="MFA">
            <ul className={style.ull}>
              <li>
                Set up or update your MFA (Multi-Factor Authentication) sign-in
                method
              </li>
            </ul>
          </PageCard>
        </Card.GroupItem>
      </Card.Group>
    </div>
  );
};

export default Home;

function PageCard({
  isClickable,
  route,
  linkHeader,
  children
}: Readonly<HomeCardProps>) {
  return (
    <Card
      clickable={isClickable}
      onClick={(e: { preventDefault: () => void }) => {
        e.preventDefault();
        handleClick(route);
      }}
      data-cy={linkHeader}
    >
      <Card.Content>
        <Card.Heading className="nhsuk-heading-m">
          <Card.Link href="">{linkHeader}</Card.Link>
        </Card.Heading>
        {children}
      </Card.Content>
    </Card>
  );
}
