import React from "react";
import { Helmet } from "react-helmet";

interface PageProps {
  title?: string;
}
const PageTitle = (props: PageProps): JSX.Element => {
  const siteTitle = "TIS Self-Service";
  let pageTitle: string = props.title
    ? `${siteTitle} | ${props.title}`
    : siteTitle;

  return (
    <Helmet>
      <title>{pageTitle}</title>
    </Helmet>
  );
};

export default PageTitle;
