import { Fieldset } from "nhsuk-react-components";
import React, { FunctionComponent } from "react";
import ScrollTo from "../forms/ScrollTo";
import Loading from "./Loading";

interface sectionsArray {
  component: FunctionComponent<any>;
  title: string;
}

interface ISectionGenerator<U> {
  section: number;
  sectionsArr: sectionsArray[];
  sectionProps: U;
}

const SectionGenerator = <U,>({
  section,
  sectionsArr,
  sectionProps
}: ISectionGenerator<U>): JSX.Element => {
  return (
    <>
      <ScrollTo />
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
