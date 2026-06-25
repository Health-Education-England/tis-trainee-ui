import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";

jest.mock("nhsuk-react-components", () => {
  const React = require("react");
  const actual = jest.requireActual("nhsuk-react-components");

  const Button = React.forwardRef(
    (
      {
        as,
        asElement,
        className,
        login,
        preventDoubleClick,
        reverse,
        secondary,
        secondarySolid,
        small,
        warning,
        ...props
      },
      ref
    ) => {
      const Element = asElement ?? (as === "a" ? "a" : "button");

      return React.createElement(Element, {
        ...props,
        className,
        ref
      });
    }
  );

  Button.displayName = "MockNhsukButton";

  return {
    ...actual,
    Button
  };
});
