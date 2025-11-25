import { Fieldset, Legend } from "nhsuk-react-components";
import React, { FunctionComponent } from "react";
import ScrollTo from "../../components/forms/ScrollTo";
import Loading from "./Loading";
import FormBackLink from "./FormBackLink";

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
      <FormBackLink history={history} path={path} text="Start over" />
      <main>
        <Fieldset>
          <Legend size="l">{sectionsArr[section - 1].title}</Legend>
        </Fieldset>
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
