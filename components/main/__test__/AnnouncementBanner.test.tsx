import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { AnnouncementBanner } from "../AnnouncementBanner";
import { Announcement } from "../../../models/Announcement";

describe("AnnouncementBanner", () => {
  const announcements: Announcement[] = [
    {
      id: "1",
      title: "Test title 1",
      content: {
        raw: {
          children: [
            {
              type: "paragraph",
              children: [{ text: "First announcement" }]
            }
          ]
        }
      }
    },
    {
      id: "2",
      title: "Test title 2",
      content: {
        raw: {
          children: [
            {
              type: "paragraph",
              children: [
                { text: "Second announcement " },
                {
                  type: "link",
                  href: "https://example.com",
                  openInNewTab: true,
                  children: [{ text: "link" }]
                }
              ]
            }
          ]
        }
      }
    }
  ];

  it("renders nothing when there are no announcements", () => {
    const { container } = render(
      <AnnouncementBanner announcements={[]} onDismiss={jest.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders each announcement's title and rich text content", () => {
    render(
      <AnnouncementBanner announcements={announcements} onDismiss={jest.fn()} />
    );

    expect(
      screen.getByRole("heading", { name: "Test title 1" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Test title 2" })
    ).toBeInTheDocument();
    expect(screen.getByText("First announcement")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "link" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveClass("nhsuk-action-link");
  });

  it("calls onDismiss with the announcement id when its close button is clicked", () => {
    const onDismiss = jest.fn();
    render(
      <AnnouncementBanner announcements={announcements} onDismiss={onDismiss} />
    );

    const dismissButtons = screen.getAllByRole("button", {
      name: "Dismiss announcement"
    });
    fireEvent.click(dismissButtons[0]);

    expect(onDismiss).toHaveBeenCalledWith("1");
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
