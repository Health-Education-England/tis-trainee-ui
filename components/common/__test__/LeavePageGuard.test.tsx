import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LeavePageGuard } from "../LeavePageGuard";

const guard = (hasUnsavedChanges: boolean) => (
  <MemoryRouter>
    <LeavePageGuard hasUnsavedChanges={hasUnsavedChanges} />
  </MemoryRouter>
);

const isUnloadCancelled = () => {
  const event = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(event);
  return event.defaultPrevented;
};

describe("LeavePageGuard", () => {
  it("lets the page unload when there are no unsaved changes", () => {
    render(guard(false));
    expect(isUnloadCancelled()).toBe(false);
  });

  it("asks the browser to warn before the page unloads while there are unsaved changes", () => {
    render(guard(true));
    expect(isUnloadCancelled()).toBe(true);
  });

  it("stops asking once there are no unsaved changes left", () => {
    const { rerender } = render(guard(true));
    rerender(guard(false));
    expect(isUnloadCancelled()).toBe(false);
  });

  it("stops asking once it's removed from the page", () => {
    const { unmount } = render(guard(true));
    unmount();
    expect(isUnloadCancelled()).toBe(false);
  });
});
