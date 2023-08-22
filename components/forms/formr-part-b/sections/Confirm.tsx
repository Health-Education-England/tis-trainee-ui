import ScrollTo from "../../ScrollTo";
import Declarations from "./Declarations";
import View from "../viewSections/View";
import { IProgSection } from "../../../../models/IProgressSection";

interface IConfirm {
  prevSectionLabel: string;
  history: any;
  finalSections: IProgSection[];
}

const Confirm = ({ prevSectionLabel, history, finalSections }: IConfirm) => {
  const canEdit: boolean = true;

  return (
    <>
      <ScrollTo />
      <View canEdit={canEdit} history={history} />
      <Declarations
        prevSectionLabel={prevSectionLabel}
        history={history}
        finalSections={finalSections}
      />
    </>
  );
};

export default Confirm;
