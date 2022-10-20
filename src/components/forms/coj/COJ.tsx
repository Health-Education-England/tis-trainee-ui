import { BackLink, Card } from "nhsuk-react-components";
import { Route, Switch, useLocation } from "react-router-dom";
import { ProgrammeMembership } from "../../../models/ProgrammeMembership";
import COJList from "./COJList";
import COJView from "./COJView";
import history from "../../navigation/history";
interface ICOJ {
  sortedProgrammes: ProgrammeMembership[];
}

const COJ: React.FC<ICOJ> = ({ sortedProgrammes }) => {
  let pathname = useLocation().pathname;
  return (
    <>
      <Card feature>
        <Card.Content>
          <Card.Heading> Conditions of Joining agreement</Card.Heading>
          {pathname !== "/profile/programmes" && (
            <BackLink
              data-cy="backLink"
              style={{ cursor: "pointer" }}
              onClick={() => history.push("/profile/programmes")}
            >
              Go back to list
            </BackLink>
          )}
          <Switch>
            <Route path="/profile/programmes/:id" component={COJView} />
            <Route
              path="/profile/programmes"
              render={() => <COJList sortedProgrammes={sortedProgrammes} />}
            />
          </Switch>
        </Card.Content>
      </Card>
    </>
  );
};

export default COJ;
