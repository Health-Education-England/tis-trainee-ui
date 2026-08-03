import { getAnnouncements } from "../AnnouncementsService";
import { Announcement } from "../../models/Announcement";

const mockedAnnouncements: Announcement[] = [
  {
    id: "cmcc4s2bpppir06mmwvheyzjd",
    title: "Test 2",
    content: {
      raw: {
        children: [
          { type: "paragraph", children: [{ text: "Some content" }] }
        ]
      }
    }
  }
];

describe("AnnouncementsService", () => {
  it("returns expected data when calling getAnnouncements", async () => {
    Object.defineProperty(globalThis, "fetch", {
      value: jest.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({ data: { announcements: mockedAnnouncements } })
      }),
      writable: true,
      configurable: true
    });

    const result = await getAnnouncements();

    expect(result).toEqual(mockedAnnouncements);
  });
});
