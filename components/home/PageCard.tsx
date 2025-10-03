import history from "../navigation/history";
import style from "../Common.module.scss";
import { Card } from "nhsuk-react-components";
import { isFeatureEnabled } from "../../utilities/FeatureFlagUtilities";
import { UserFeaturesType } from "../../models/FeatureFlags";
import { HomeCardProps } from "../../models/HomeCard";

const handleClick = (route: string) => history.push(route);

interface PageCardProps extends HomeCardProps {
  userFeatures: UserFeaturesType;
}

export function PageCard({
  isClickable,
  route,
  linkHeader,
  items,
  userFeatures
}: Readonly<PageCardProps>) {
  const listItems = items
    .filter(item => isFeatureEnabled(item.isFeatureEnabled, userFeatures))
    .map(item => <li key={item.text}>{item.text}</li>);

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
        <ul className={style.ull}>{listItems}</ul>
      </Card.Content>
    </Card>
  );
}
