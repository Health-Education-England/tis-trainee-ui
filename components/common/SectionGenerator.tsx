import { BackLink, Fieldset } from "nhsuk-react-components";
import React, { FunctionComponent } from "react";
import ScrollTo from "../../components/forms/ScrollTo";
import Loading from "./Loading";

interface SectionsArray {
  component: FunctionComponent<any>;
  title: string;
}

interface ISectionGenerator<U> {
  history: any;
  path: string;
  section: number;
  sectionsArr: SectionsArray[];
  sectionProps?: U;
}

const SectionGenerator = <U,>({
  history,
  path,
  section,
  sectionsArr,
  sectionProps
}: ISectionGenerator<U>): JSX.Element => {
  return (
    <>
      <ScrollTo />
      <BackLink
        data-cy="backLink"
        style={{ cursor: "pointer" }}
        onClick={() => history.push(path)}
      >
        Start over
      </BackLink>
      <main>
        <Fieldset.Legend size="l">
          {sectionsArr[section - 1].title}
        </Fieldset.Legend>
        <div className="form-wrapper">
          <section>
            <div className="page-wrapper">
              {section < sectionsArr.length + 1 ? (
                React.createElement(
                  sectionsArr[section - 1].component,
                  sectionProps
                )
              ) : (
                <Loading />
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default SectionGenerator;
