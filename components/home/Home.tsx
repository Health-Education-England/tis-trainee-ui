import { Card, Fieldset } from "nhsuk-react-components";
import { useAppSelector } from "../../redux/hooks/hooks";
import { chunkArray } from "../../utilities/ListUtilities";
import { isFeatureEnabled } from "../../utilities/FeatureFlagUtilities";
import { PageCard } from "./PageCard";
import { HOME_CARDS } from "./HomeCards";

const Home = () => {
  const userFeatures = useAppSelector(state => state.user.features);

  const enabledHomeCards = HOME_CARDS.filter(card =>
    isFeatureEnabled(card.isFeatureEnabled, userFeatures)
  );
  const cardGroups = chunkArray(enabledHomeCards, 3);

  return (
    <div className="nhsuk-width-container nhsuk-u-margin-top-5">
      <Fieldset.Legend size="m" data-cy="tssOverview">
        TIS Self-Service overview
      </Fieldset.Legend>

      {cardGroups.map((group, index) => (
        <Card.Group key={index}>
          {group.map(card => (
            <Card.GroupItem key={card.linkHeader} width="one-third">
              <PageCard {...card} userFeatures={userFeatures} />
            </Card.GroupItem>
          ))}
        </Card.Group>
      ))}
    </div>
  );
};

export default Home;
