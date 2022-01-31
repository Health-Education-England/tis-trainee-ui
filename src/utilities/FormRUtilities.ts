import Section1 from "../components/forms/formr-part-b/sections/Section1";
import Section2 from "../components/forms/formr-part-b/sections/Section2";
import Section3 from "../components/forms/formr-part-b/sections/Section3";
import Section4 from "../components/forms/formr-part-b/sections/Section4";
import Section5 from "../components/forms/formr-part-b/sections/Section5";
import Section6 from "../components/forms/formr-part-b/sections/Section6";
import CovidDeclaration from "../components/forms/formr-part-b/sections/CovidDeclaration";
import { IProgSection } from "../models/IProgressSection";

export class FormRUtilities {
  public static makeFormRBSections(covidFlag: boolean) {
    if (!covidFlag) return defaultSections;
    else
      return [
        ...defaultSections.slice(0, 6),
        covidSection,
        ...defaultSections.slice(6)
      ];
  }
}

const defaultSections: IProgSection[] = [
  {
    component: Section1,
    title: "Section 1:\nDoctor's details"
  },

  {
    component: Section2,
    title: "Section 2:\nWhole Scope of Practice"
  },

  {
    component: Section3,
    title: "Section 3:\nDeclarations relating to\nGood Medical Practice"
  },
  {
    component: Section4,
    title: "Section 4:\nUpdate to your last Form R"
  },
  {
    component: Section5,
    title: "Section 5:\nNew Declarations\nsince your last Form R"
  },
  {
    component: Section6,
    title: "Section 6:\nCompliments"
  }
];

const covidSection: IProgSection = {
  component: CovidDeclaration,
  title: "Covid declaration"
};
