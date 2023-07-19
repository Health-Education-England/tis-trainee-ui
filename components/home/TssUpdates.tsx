import { ListPanel } from "nhsuk-react-components";
import { useAppSelector } from "../../redux/hooks/hooks";
import { useMemo } from "react";
import { Post } from "../../models/WPPost";

type PostSummary = Pick<Post, "id" | "title" | "excerpt">;

export const TssUpdates: React.FC = () => {
  const whatsNewHeader = "What's New";
  const whatsNewStatus = useAppSelector(state => state.tssUpdates.status);
  const whatsNewPosts: Post[] = useAppSelector(
    state => state.tssUpdates.tssUpdates
  );

  const filteredPosts = useMemo(() => {
    const filteredPosts: PostSummary[] = [];
    if (whatsNewPosts.length === 0) {
      return [];
    }
    for (const post of whatsNewPosts) {
      if (post.tags.includes(20)) {
        filteredPosts.push({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt
        });
      }
    }
    return filteredPosts;
  }, [whatsNewPosts]);

  const addWhatsNewPosts = (): JSX.Element[] | JSX.Element => {
    if (filteredPosts.length === 0) {
      return <p data-cy="noUpdates">No updates available</p>;
    }
    return filteredPosts.map(post => {
      return (
        <ListPanel.Item key={post.id}>
          <h3 data-cy={`postTitle${post.id}`}>{post.title.rendered}</h3>
          <p data-cy={`postExcerpt${post.id}`}>
            {extractTextFromHTML(post.excerpt.rendered)}
          </p>
        </ListPanel.Item>
      );
    });
  };

  if (whatsNewStatus === "loading") {
    return (
      <div className="tss-update-content">
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
      <div className="tss-update-content">
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
    <div className="tss-update-content" data-cy="tssUpdatesContainer">
      <h2 data-cy="whatsNewHeader">{whatsNewHeader}</h2>
      <ListPanel>{addWhatsNewPosts()}</ListPanel>
      <div>
        <a
          data-cy="readMoreLink"
          className="nhsuk-link custom-link"
          href="https://tis-support.hee.nhs.uk/about-tis/welcome-to-the-tss-updates/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Click here to read more
        </a>
      </div>
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
