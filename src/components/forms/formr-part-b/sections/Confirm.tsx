import { FormRPartB } from "../../../../models/FormRPartB";
import ScrollTo from "../../ScrollTo";
import Declarations from "./Declarations";
import View from "../View";

interface IConfirm {
  prevSectionLabel: string;
  saveDraft: (formData: FormRPartB) => Promise<void>;
  history: any;
}

const Confirm = ({ prevSectionLabel, saveDraft, history }: IConfirm) => {
  const canEdit: boolean = true;

  return (
    <>
      <ScrollTo />
      <View canEdit={canEdit} history={history} />
      <Declarations
        prevSectionLabel={prevSectionLabel}
        saveDraft={saveDraft}
        history={history}
      />
    </>
  );
};

export default Confirm;
