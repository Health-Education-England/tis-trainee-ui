import { act, render } from "@testing-library/react";
import Loading from "../Loading";

describe("Loading", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("shows the spinner at once when there is no delay", () => {
    const { container } = render(<Loading />);
    expect(container.querySelector('[data-cy="loading"]')).not.toBeNull();
    expect(container.querySelector("output")).toBeNull();
  });

  it("renders nothing until the delay passes when there is no text", () => {
    const { container } = render(<Loading delay={300} />);
    expect(container.innerHTML).toBe("");

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(container.querySelector('[data-cy="loading"]')).not.toBeNull();
  });

  it("puts the text into an output that was already on the page once the delay passes", () => {
    const { container } = render(<Loading delay={300} text="Calculating…" />);
    const output = container.querySelector("output");
    expect(output).not.toBeNull();
    expect(output?.textContent).toBe("");
    expect(output?.parentElement).toHaveClass("nhsuk-u-visually-hidden");
    expect(container.querySelector('[data-cy="loading"]')).toBeNull();

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(container.querySelector("output")).toBe(output);
    expect(output?.textContent).toBe("Calculating…");
    expect(output?.parentElement).toHaveClass("nhsuk-body");
    expect(container.querySelector('[data-cy="loading"]')).not.toBeNull();
  });
});
