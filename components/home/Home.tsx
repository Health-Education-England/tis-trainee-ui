import { Card, Fieldset, Legend } from "nhsuk-react-components";
import { useAppSelector } from "../../redux/hooks/hooks";
import { chunkArray } from "../../utilities/ListUtilities";
import { isFeatureEnabled } from "../../utilities/FeatureFlagUtilities";
import { useIsShowNews } from "../../utilities/hooks/useIsShowNews";
import { PageCard } from "./PageCard";
import { HOME_CARDS } from "./HomeCards";

const Home = () => {
  const userFeatures = useAppSelector(state => state.user.features);
  const isShowNews = useIsShowNews();

  const enabledHomeCards = HOME_CARDS.filter(card =>
    isFeatureEnabled(card.isFeatureEnabled, userFeatures)
  );
  const cardGroups = chunkArray(enabledHomeCards, 3);

  return (
    <div className="nhsuk-width-container nhsuk-u-margin-top-5">
      <Fieldset>
        <Legend size="m" data-cy="tssOverview">
          TIS Self-Service overview
        </Legend>
      </Fieldset>

      {isShowNews && (
        <p className="nhsuk-u-margin-bottom-4">
          <a
            href="https://tis-support.hee.nhs.uk/about-tis/welcome-to-the-tss-updates/"
            target="_blank"
            rel="noopener noreferrer"
            data-cy="whatsNewLink"
          >
            What&apos;s New in TIS Self-Service
          </a>
        </p>
      )}

      {cardGroups.map((group, index) => (
        <Card.Group key={index}>
          {group.map(card => (
            <Card.GroupItem
              data-cy="card-group-item"
              key={card.linkHeader}
              width="one-third"
            >
              <PageCard {...card} userFeatures={userFeatures} />
            </Card.GroupItem>
          ))}
        </Card.Group>
      ))}
    </div>
  );
};

export default Home;
