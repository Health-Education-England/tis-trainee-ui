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
      return <p>No updates available</p>;
    }
    return filteredPosts.map(post => {
      return (
        <ListPanel.Item key={post.id}>
          <h3>{post.title.rendered}</h3>
          <p>{extractTextFromHTML(post.excerpt.rendered)}</p>
        </ListPanel.Item>
      );
    });
  };

  if (whatsNewStatus === "loading") {
    return (
      <div className="tss-update-content">
        <p>
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
        <p>
          Failed to load{" "}
          <b>
            <i>{whatsNewHeader}</i>
          </b>
        </p>
      </div>
    );
  }

  return (
    <div className="tss-update-content">
      <h2>{whatsNewHeader}</h2>
      <ListPanel>{addWhatsNewPosts()}</ListPanel>
      <div>
        <a
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
  return "";
}
