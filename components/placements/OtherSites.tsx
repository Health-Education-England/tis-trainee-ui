import { Site } from "../../models/Placement";
import style from "../Common.module.scss";

type OtherSitesProps = {
  otherSites: Site[];
};

export function OtherSites({ otherSites }: Readonly<OtherSitesProps>) {
  if (otherSites?.length > 0) {
    return (
      <>
        {otherSites.map(
          (
            { site, siteKnownAs, siteLocation }: Site,
            index: number
          ): JSX.Element => (
            <div key={index} className={style.cItems}>
              <div data-cy={`otherSite${index}Val`}>{siteKnownAs ?? site}</div>
              {siteLocation && (
                <div data-cy={`otherSiteLocation${index}Val`}>
                  {siteLocation}
                </div>
              )}
            </div>
          )
        )}
      </>
    );
  } else return <div>None provided</div>;
}
