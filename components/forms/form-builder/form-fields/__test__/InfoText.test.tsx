import { render } from "@testing-library/react";
import dayjs from "dayjs";
import { InfoText } from "../InfoText";
import { DateUtilities } from "../../../../../utilities/DateUtilities";

const getInset = (container: HTMLElement, name: string) =>
  container.querySelector(`[data-cy="${name}-info"]`) as HTMLElement;

describe("InfoText", () => {
  it("renders an empty inset text when no label is provided", () => {
    const { container } = render(<InfoText name="noLabel" />);

    const inset = getInset(container, "noLabel");
    expect(inset).toBeInTheDocument();
    expect(inset.querySelector("p")).toBeEmptyDOMElement();
    expect(inset.querySelector("strong")).not.toBeInTheDocument();
  });

  it("renders the label as-is when it contains no '{value}' token", () => {
    const { container } = render(
      <InfoText name="plain" label="Some plain info text." />
    );

    const inset = getInset(container, "plain");
    expect(inset).toHaveTextContent("Some plain info text.");
    expect(inset.querySelector("strong")).not.toBeInTheDocument();
  });

  it("renders nothing and warns when '{value}' is present but no computedValue resolves (misconfiguration)", () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    const { container } = render(
      <InfoText name="tokenNoValue" label="You have until {value} to reply." />
    );

    expect(getInset(container, "tokenNoValue")).not.toBeInTheDocument();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('InfoText "tokenNoValue"')
    );

    warnSpy.mockRestore();
  });

  it("replaces '{value}' with the computed value formatted as a local date", () => {
    const { container } = render(
      <InfoText
        name="withValue"
        label="You have until {value} to reply."
        computedValue="ltft16WeeksNoticeDate"
      />
    );

    const expectedDate = DateUtilities.ToLocalDate(
      dayjs().add(16, "week").format("YYYY-MM-DD")
    );

    const inset = getInset(container, "withValue");
    expect(inset.querySelector("strong")).toHaveTextContent(expectedDate);
    expect(inset).toHaveTextContent(`You have until ${expectedDate} to reply.`);
  });
});
