import { Announcement } from "../models/Announcement";

const hygraphUri = process.env.NEXT_PUBLIC_HYGRAPH_URI;
const environmentName = process.env.NEXT_PUBLIC_ENVIRONMENT_NAME;

function buildAnnouncementsQuery(environmentName: string): string {
  return `
    query Announcements($now: DateTime!) {
      announcements(
        orderBy: publishDate_DESC
        where: {
          publishTo_contains_all: [${environmentName}]
          publishDate_lte: $now
          OR: [{ expiryDate_gt: $now }, { expiryDate: null }]
        }
      ) {
        id
        title
        content {
          raw
        }
      }
    }
  `;
}

export async function getAnnouncements(): Promise<Announcement[]> {
  if (!hygraphUri || !environmentName) return [];

  const response = await fetch(hygraphUri, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: buildAnnouncementsQuery(environmentName),
      variables: {
        now: new Date().toISOString()
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Hygraph request failed with status ${response.status}`);
  }

  const { data, errors } = await response.json();

  if (errors?.length) {
    throw new Error(errors[0].message);
  }

  return data?.announcements ?? [];
}
