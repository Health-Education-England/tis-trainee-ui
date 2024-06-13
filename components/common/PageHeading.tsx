import { Fieldset } from "nhsuk-react-components";
import PageTitle from "./PageTitle";
import ScrollTo from "../../components/forms/ScrollTo";

type PageHeadingProps = {
  title: string;
  headingDataCy: string;
  subHeadingDataCy: string;
  subHeadingText: string;
};

export default function PageHeading({
  title,
  headingDataCy,
  subHeadingDataCy,
  subHeadingText
}: Readonly<PageHeadingProps>) {
  return (
    <>
      <PageTitle title={title} />
      <ScrollTo />
      <Fieldset>
        <Fieldset.Legend
          isPageHeading
          className="fieldset-legend__header"
          data-cy={headingDataCy}
        >
          {title}
        </Fieldset.Legend>
        <p data-cy={subHeadingDataCy}>
          <strong>{subHeadingText}</strong>
        </p>
      </Fieldset>
    </>
  );
}
