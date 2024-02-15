import { createRoot } from "react-dom/client";
import { act } from "@testing-library/react";
import ScrollToTop from "../ScrollToTop";

let container: HTMLDivElement | null = null;
let root: { unmount: (arg0: HTMLDivElement) => void } | null = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  if (root && container) {
    root.unmount(container);
    container.remove();
    container = null;
  }
});

it("scrolls to top when page changes and there are no errors", () => {
  window.scrollTo = jest.fn();
  act(() => {
    createRoot(container!).render(
      <ScrollToTop errors={{}} page={1} isPageDirty={false} />
    );
  });
  expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
});

it("does not scroll to top when there are errors (after user interacts with form page) so the user can read the error summary", () => {
  window.scrollTo = jest.fn();
  act(() => {
    createRoot(container!).render(
      <ScrollToTop errors={{ field: "error" }} page={1} isPageDirty={true} />
    );
  });
  expect(window.scrollTo).not.toHaveBeenCalled();
});

it("does not scroll to top when page is dirty and no errors (e.g. for when user clears errors on the page and doesn't glide back to the top!)", () => {
  window.scrollTo = jest.fn();
  act(() => {
    createRoot(container!).render(
      <ScrollToTop errors={{}} page={1} isPageDirty={true} />
    );
  });
  expect(window.scrollTo).not.toHaveBeenCalled();
});
