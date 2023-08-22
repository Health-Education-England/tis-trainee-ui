import { FormRPartB } from "./FormRPartB";

export interface IFormRPartBSection {
  prevSectionLabel: string;
  nextSectionLabel: string;
  previousSection: number | null;
  handleSectionSubmit: (formData: FormRPartB) => void;
}
