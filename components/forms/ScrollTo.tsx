import React from "react";

interface IProps {
  location?: "top" | "element";
  scrollType?: "auto" | "smooth";
  offset?: number;
  offsetMobile?: number;
}
export default class ScrollTo extends React.Component<IProps> {
  elementRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    const {
      location = "top",
      scrollType,
      offset = 0,
      offsetMobile = -40
    } = this.props;
    const element = this.elementRef.current;

    if (location === "element" && element) {
      let verticalScroll = element.offsetTop + offset;

      if (window.matchMedia("screen and (max-width: 768px)").matches) {
        verticalScroll = verticalScroll + offsetMobile;
      }

      window.scrollTo({
        top: verticalScroll,
        behavior: scrollType ?? "auto"
      });
    } else {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return <div ref={this.elementRef}></div>;
  }
}
