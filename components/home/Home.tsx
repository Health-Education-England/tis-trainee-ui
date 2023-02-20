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

const PageCard = ({
  isClickable,
  route,
  linkHeader,
  children
}: HomeCardProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetMfaJourney());
  }, [dispatch]);

  const preferredMfa = useAppSelector(state => state.user.preferredMfa);

  if (preferredMfa === "NOMFA") {
    return <Redirect to="/mfa" />;
  }
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
        <ul className={style.ull}>{children}</ul>
      </Card.Content>
    </Card>
  );
};
const Home = () => {
  return (
    <>
      <div className="nhsuk-width-container nhsuk-u-margin-top-5">
        <Card.Group>
          <Card.GroupItem width="one-third">
            <PageCard isClickable={true} route="/profile" linkHeader="Profile">
              <li>your personal information</li>
              <li>registration details</li>
            </PageCard>
          </Card.GroupItem>
          <Card.GroupItem width="one-third">
            <PageCard
              isClickable={true}
              route="/placements"
              linkHeader="Placements"
            >
              <li>a list of your Placements (past, current and future)</li>
            </PageCard>
          </Card.GroupItem>
          <Card.GroupItem width="one-third">
            <PageCard
              isClickable={true}
              route="/programmes"
              linkHeader="Programmes"
            >
              <li>a list of your Programmes (past, current and future)</li>
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
              <li>submit a new form</li>
              <li>view and save a PDF copy of a submitted form</li>
            </PageCard>
          </Card.GroupItem>
          <Card.GroupItem width="one-third">
            <PageCard
              isClickable={true}
              route="/formr-b"
              linkHeader="Form R (Part B)"
            >
              <li>submit a new form</li>
              <li>view and save a PDF copy of a submitted form</li>
            </PageCard>
          </Card.GroupItem>
          <Card.GroupItem width="one-third">
            <PageCard isClickable={true} route="/mfa" linkHeader="MFA">
              <li>
                Set-up or update your MFA (Multi-Factor Authentication) sign-in
                method
              </li>
            </PageCard>
          </Card.GroupItem>
        </Card.Group>
        <Card.Group>
          <Card.GroupItem width="one-third">
            <PageCard isClickable={true} route="/support" linkHeader="Support">
              <li>email your Local Office for Form R-related queries</li>
              <li>
                email TIS Support with any technical issues (e.g. error
                messages)
              </li>
            </PageCard>
          </Card.GroupItem>
        </Card.Group>
      </div>
    </>
  );
};

export default Home;
