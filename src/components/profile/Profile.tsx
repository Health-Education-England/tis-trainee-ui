import PersonalDetailsComponent from "./personal-details/PersonalDetailsComponent";
import Programmes from "./programmes/Programmes";
import Placements from "./placements/Placements";
import {
  BackLink,
  Card,
  Fieldset,
  WarningCallout
} from "nhsuk-react-components";
import PageTitle from "../common/PageTitle";
import ScrollTo from "../forms/ScrollTo";

import { useAppSelector } from "../../redux/hooks/hooks";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";
import DataSourceMsg from "../common/DataSourceMsg";
import {
  NavLink,
  Redirect,
  Route,
  Switch,
  useLocation
} from "react-router-dom";
import PageNotFound from "../common/PageNotFound";
import history from "../navigation/history";
import store from "../../redux/store/store";

const Profile = ({ mfa }: any) => {
  const { personalDetails, placements, programmeMemberships } =
    useAppSelector(selectTraineeProfile);

  // TODO placeholder logic
  const hasSignedCoj = store.getState().user.hasSignedCoj;

  let pathname = useLocation().pathname;

  const chooseHeader = () => {
    switch (pathname) {
      case "/profile/details":
        return "Personal Details";
      case "/profile/placements":
        return "Placements";
      case "/profile/programmes":
        return "Programmes";
      case "/profile":
        return "Profile summary";
      default:
        return "Programmes";
    }
  };

  if (mfa === "NOMFA") {
    return <Redirect to="/mfa" />;
  }

  return (
    <>
      <div id="profile">
        {pathname !== "/profile" && (
          <BackLink
            data-cy="backLink"
            style={{ cursor: "pointer" }}
            onClick={() => history.push("/profile")}
          >
            Go back to Profile summary
          </BackLink>
        )}
        <PageTitle title="Profile" />
        <ScrollTo />
        <Fieldset>
          <Fieldset.Legend
            isPageHeading
            style={{ color: "#005EB8" }}
            data-cy="profileHeading"
          >
            {chooseHeader()}
          </Fieldset.Legend>
        </Fieldset>
        {pathname === "/profile" && !hasSignedCoj && (
          <WarningCallout>
            <WarningCallout.Label>Warning</WarningCallout.Label>
            <div>
              <span>
                You have no signed Conditions of Joining agreement for a
                Programme.{" "}
              </span>
              <NavLink data-cy="prLink" to="/profile/programmes">
                Click here to sign.
              </NavLink>
            </div>
          </WarningCallout>
        )}
        <Switch>
          <Route
            path="/profile/details"
            render={() => (
              <PersonalDetailsComponent personalDetails={personalDetails} />
            )}
          />
          <Route
            path="/profile/placements"
            render={() => <Placements placements={placements} />}
          />
          <Route
            path="/profile/programmes"
            render={() => (
              <Programmes programmeMemberships={programmeMemberships} />
            )}
          />
          <Route path="/profile" render={() => <ProfileSummary />} />
          <Redirect exact path="/" to="/profile" />
          <Route path="/*" component={PageNotFound} />
        </Switch>
        <DataSourceMsg />
      </div>
    </>
  );
};

function ProfileSummary() {
  return (
    <>
      <Card.Group>
        <Card.GroupItem width="one-third">
          <Card>
            <Card.Content>
              <Card.Heading className="nhsuk-heading-m">
                <NavLink data-cy="pdLink" to="/profile/details">
                  Personal details
                </NavLink>
              </Card.Heading>
              <ul>
                <li>your personal information</li>
                <li>registration details</li>
              </ul>
            </Card.Content>
          </Card>
        </Card.GroupItem>
        <Card.GroupItem width="one-third">
          <Card>
            <Card.Content>
              <Card.Heading className="nhsuk-heading-m">
                <NavLink data-cy="plLink" to="/profile/placements">
                  Placements
                </NavLink>
              </Card.Heading>
              <ul>
                <li>a list of your Placements (past, current and future)</li>
              </ul>
            </Card.Content>
          </Card>
        </Card.GroupItem>
        <Card.GroupItem width="one-third">
          <Card>
            <Card.Content>
              <Card.Heading className="nhsuk-heading-m">
                <NavLink data-cy="prLink" to="/profile/programmes">
                  Programmes
                </NavLink>
              </Card.Heading>
              <ul>
                <li>a list of your Programmes (past, current and future)</li>
                <li>your Conditions of Joining agreement</li>
              </ul>
            </Card.Content>
          </Card>
        </Card.GroupItem>
      </Card.Group>
    </>
  );
}

export default Profile;
