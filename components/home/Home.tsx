import { Card } from "nhsuk-react-components";
import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { resetMfaJourney } from "../../redux/slices/userSlice";
import history from "../navigation/history";
import style from "./Home.module.scss";

const handleClick = (route: string) => history.push(route);

interface HomeCardProps {
  isClickable: boolean;
  route: string;
  linkHeader: string;
  children: any;
}

const Home = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetMfaJourney());
  }, [dispatch]);

  const preferredMfa = useAppSelector(state => state.user.preferredMfa);

  if (preferredMfa === "NOMFA") {
    return <Redirect to="/mfa" />;
  }
  return (
    <>
      <div className="nhsuk-width-container nhsuk-u-margin-top-5">
        <Card.Group>
          <Card.GroupItem width="one-third">
            <PageCard isClickable={true} route="/profile" linkHeader="Profile">
              <ul className={style.ull}>
                <li>your personal information</li>
                <li>registration details</li>
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
                <li>a list of your Placements (past, current and future)</li>
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
                <li>a list of your Programmes (past, current and future)</li>
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
                <li>submit a new form</li>
                <li>view and save a PDF copy of a submitted form</li>
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
                <li>submit a new form</li>
                <li>view and save a PDF copy of a submitted form</li>
              </ul>
            </PageCard>
          </Card.GroupItem>
          <Card.GroupItem width="one-third">
            <PageCard isClickable={true} route="/mfa" linkHeader="MFA">
              <ul className={style.ull}>
                <li>
                  Set-up or update your MFA (Multi-Factor Authentication)
                  sign-in method
                </li>
              </ul>
            </PageCard>
          </Card.GroupItem>
        </Card.Group>
        <Card.Group>
          <Card.GroupItem width="one-third">
            <PageCard isClickable={true} route="/support" linkHeader="Support">
              <ul className={style.ull}>
                <li>email your Local Office for Form R-related queries</li>
                <li>
                  email TIS Support with any technical issues (e.g. error
                  messages)
                </li>
              </ul>
            </PageCard>
          </Card.GroupItem>
        </Card.Group>
      </div>
    </>
  );
};

export default Home;

function PageCard({ isClickable, route, linkHeader, children }: HomeCardProps) {
  return (
    <Card
      clickable={isClickable}
      onClick={(e: { preventDefault: () => void }) => {
        e.preventDefault();
        handleClick(route);
      }}
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
