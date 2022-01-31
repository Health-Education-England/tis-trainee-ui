import { FormRPartB } from "../../../../models/FormRPartB";
import ScrollTo from "../../ScrollTo";
import Declarations from "./Declarations";
import View from "../View";
import { IProgSection } from "../../../../models/IProgressSection";

interface IConfirm {
  prevSectionLabel: string;
  saveDraft: (formData: FormRPartB) => Promise<void>;
  history: any;
  finalSections: IProgSection[];
}

const Confirm = ({
  prevSectionLabel,
  saveDraft,
  history,
  finalSections
}: IConfirm) => {
  const canEdit: boolean = true;

  return (
    <>
      <ScrollTo />
      <View canEdit={canEdit} history={history} />
      <Declarations
        prevSectionLabel={prevSectionLabel}
        saveDraft={saveDraft}
        history={history}
        finalSections={finalSections}
      />
    </>
  );
};

export default Confirm;
