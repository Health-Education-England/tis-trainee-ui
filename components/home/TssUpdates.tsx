import { ListPanel } from "nhsuk-react-components";
import { useAppSelector } from "../../redux/hooks/hooks";
import { Post } from "../../models/WPPost";

type PostSummary = Pick<Post, "id" | "title" | "excerpt">;

export const TssUpdates: React.FC = () => {
  const whatsNewHeader = "What's New";
  const whatsNewStatus = useAppSelector(state => state.tssUpdates.status);
  const whatsNewPost: Post = useAppSelector(
    state => state.tssUpdates.tssUpdates
  )[0];
  const { id, title, excerpt }: PostSummary = whatsNewPost ?? {};

  if (whatsNewStatus === "loading") {
    return (
      <div className="tss-updates-content">
        <p data-cy="loadingUpdates">
          Loading{" "}
          <b>
            <i>{whatsNewHeader}</i>
          </b>
          {/* */}
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

  if (!whatsNewPost) {
    return (
      <div className="tss-updates-content" data-cy="tssUpdatesContainer">
        <WhatsNewHeader />
        <p data-cy="noUpdates">No new updates available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="tss-updates-content" data-cy="tssUpdatesContainer">
      <WhatsNewHeader />
      <ListPanel>
        <ListPanel.Item key={id}>
          <h3 className="list-panel-header" data-cy={`postTitle${id}`}>
            {title.rendered}
          </h3>
          <p data-cy={`postExcerpt${id}`}>
            {extractTextFromHTML(excerpt.rendered)}
          </p>
        </ListPanel.Item>
      </ListPanel>
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

export function WhatsNewHeader(): JSX.Element {
  const wpUpdatesUrl =
    "https://tis-support.hee.nhs.uk/about-tis/welcome-to-the-tss-updates/";
  return (
    <p data-cy="whatsNewHeader" className="nhsuk-header whats-new-header">
      <a
        data-cy="anchorEl_What's New"
        title="Click here for more details"
        className="nhsuk-link custom-link whats-new-link"
        href={wpUpdatesUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        What&apos;s New
      </a>
    </p>
  );
}
