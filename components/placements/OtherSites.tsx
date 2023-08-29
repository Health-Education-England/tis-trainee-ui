import { Site } from "../../models/Placement";
import style from "../Common.module.scss";

type OtherSitesProps = {
  otherSites: Site[];
};

export function OtherSites({ otherSites }: OtherSitesProps) {
  if (otherSites?.length > 0) {
    return (
      <>
        {otherSites.map(
          ({ siteKnownAs, siteLocation }: Site, index: number): JSX.Element => (
            <div key={index} className={style.cItems}>
              <div data-cy={`otherSiteKnownAs${index}Val`}>{siteKnownAs}</div>
              <div data-cy={`otherSiteLocation${index}Val`}>{siteLocation}</div>
            </div>
          )
        )}
      </>
    );
  } else return <div>None provided</div>;
}
