import { FormRPartB } from "./FormRPartB";

export interface IFormRPartBSection {
  prevSectionLabel: string;
  nextSectionLabel: string;
  saveDraft: (formData: FormRPartB) => Promise<void>;
  previousSection: number | null;
  handleSectionSubmit: (formData: FormRPartB) => void;
}
