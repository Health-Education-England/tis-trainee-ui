import { RichTextContent } from "@graphcms/rich-text-types";

export interface Announcement {
  id: string;
  title: string;
  content: {
    raw: RichTextContent;
  };
}
