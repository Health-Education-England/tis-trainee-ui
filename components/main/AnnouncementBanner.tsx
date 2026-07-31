import {
  RichText,
  LinkRendererProps
} from "@graphcms/rich-text-react-renderer";
import { ActionLink, CrossIcon } from "nhsuk-react-components";
import { Announcement } from "../../models/Announcement";

type AnnouncementBannerProps = Readonly<{
  announcements: Announcement[];
  onDismiss: (id: string) => void;
}>;

// Hygraph's rich text editor can only produce plain links - this renders
// them as NHS.UK's ActionLink (arrow icon + styling) so editors don't need
// to know about nhsuk-frontend classes to get the house style.
function ActionLinkRenderer({
  children,
  href,
  openInNewTab,
  rel,
  title
}: LinkRendererProps) {
  return (
    <ActionLink
      href={href}
      title={title}
      target={openInNewTab ? "_blank" : undefined}
      rel={rel ?? (openInNewTab ? "noopener noreferrer" : undefined)}
    >
      {children}
    </ActionLink>
  );
}

export function AnnouncementBanner({
  announcements,
  onDismiss
}: AnnouncementBannerProps) {
  if (!announcements.length) return null;

  return (
    <div data-cy="announcementBanner">
      {announcements.map(announcement => (
        <div
          key={announcement.id}
          className="announcement-banner"
          data-cy="announcement"
        >
          <div className="announcement-content">
            <h3>{announcement.title}</h3>
            <div data-cy="announcementContent">
              <RichText
                content={announcement.content.raw}
                renderers={{ a: ActionLinkRenderer }}
              />
            </div>
          </div>
          <button
            type="button"
            className="announcement-banner-close"
            aria-label="Dismiss announcement"
            title="Dismiss announcement"
            onClick={() => onDismiss(announcement.id)}
          >
            <CrossIcon />
          </button>
        </div>
      ))}
    </div>
  );
}
