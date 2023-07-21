import { ListPanel } from "nhsuk-react-components";
import { useAppSelector } from "../../redux/hooks/hooks";
import { useMemo } from "react";
import { Post } from "../../models/WPPost";

type PostSummary = Pick<Post, "id" | "title" | "excerpt">;

export const TssUpdates: React.FC = () => {
  const whatsNewHeader = "What's New";
  const wpUpdatesUrl =
    "https://tis-support.hee.nhs.uk/about-tis/welcome-to-the-tss-updates/";
  const whatsNewStatus = useAppSelector(state => state.tssUpdates.status);
  const whatsNewPosts: Post[] = useAppSelector(
    state => state.tssUpdates.tssUpdates
  );
  const newSummaryPosts = useMemo(() => {
    const summaryPosts: PostSummary[] = [];
    if (whatsNewPosts?.length > 0) {
      for (const post of whatsNewPosts) {
        summaryPosts.push({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt
        });
      }
    } else return [];
    return summaryPosts;
  }, [whatsNewPosts]);

  const addWhatsNewPosts = (): JSX.Element[] | JSX.Element => {
    if (newSummaryPosts.length === 0) {
      return <p data-cy="noUpdates">No new updates available at the moment.</p>;
    }
    return newSummaryPosts.map(post => {
      return (
        <ListPanel.Item key={post.id}>
          <h3 className="list-panel-header" data-cy={`postTitle${post.id}`}>
            {post.title.rendered}
          </h3>
          <p data-cy={`postExcerpt${post.id}`}>
            {extractTextFromHTML(post.excerpt.rendered)}
          </p>
        </ListPanel.Item>
      );
    });
  };

  if (whatsNewStatus === "loading") {
    return (
      <div className="tss-updates-content">
        <p data-cy="loadingUpdates">
          Loading{" "}
          <b>
            <i>{whatsNewHeader}</i>
          </b>
          ...
        </p>
      </div>
    );
  }

  if (whatsNewStatus === "failed") {
    return (
      <div className="tss-updates-content">
        <p data-cy="failedUpdates">
          Failed to load{" "}
          <b>
            <i>{whatsNewHeader}</i>
          </b>
        </p>
      </div>
    );
  }

  return (
    <div className="tss-updates-content" data-cy="tssUpdatesContainer">
      <h2 data-cy="whatsNewHeader">
        <AnchorEl
          clName="nhsuk-link custom-link"
          hRef={wpUpdatesUrl}
          text={whatsNewHeader}
        />
      </h2>
      <ListPanel>{addWhatsNewPosts()}</ListPanel>
      {whatsNewPosts.length > 1 && (
        <AnchorEl
          clName="nhsuk-link custom-link"
          hRef={wpUpdatesUrl}
          text="Click here to read more"
        />
      )}
    </div>
  );
};

function extractTextFromHTML(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const element = doc.querySelector("p");
  if (element) {
    return element.textContent?.trim() ?? "";
  }
  return html;
}

type AnchorElProps = {
  clName: string;
  hRef: string;
  text: string;
};

function AnchorEl({ clName, hRef, text }: AnchorElProps): JSX.Element {
  return (
    <a
      data-cy={`anchorEl_${text}`}
      title="Click here for more details"
      className={clName}
      href={hRef}
      target="_blank"
      rel="noopener noreferrer"
    >
      {text}
    </a>
  );
}
