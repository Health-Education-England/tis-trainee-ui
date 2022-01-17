import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { FormRPartB } from "../../models/FormRPartB";
import { LifeCycleState } from "../../models/LifeCycleState";
import { FormsService } from "../../services/FormsService";
import { PayloadAction } from "@reduxjs/toolkit";

interface IFormB {
  formBData: FormRPartB;
  sectionNumber: number;
  previousSectionNumber: number | null;
  status: string;
  error: any;
  saveBtnActive: boolean;
}

export const initialFormState: FormRPartB = {
  forename: "",
  surname: "",
  gmcNumber: "",
  email: "",
  localOfficeName: "",
  prevRevalBody: "",
  prevRevalBodyOther: "",
  currRevalDate: null,
  prevRevalDate: null,
  programmeSpecialty: "",
  dualSpecialty: "",
  work: [],
  sicknessAbsence: 0,
  parentalLeave: 0,
  careerBreaks: 0,
  paidLeave: 0,
  unauthorisedLeave: 0,
  otherLeave: 0,
  totalLeave: 0,
  isHonest: "",
  isHealthy: "",
  isWarned: "",
  isComplying: "",
  healthStatement: "",
  havePreviousDeclarations: "",
  previousDeclarations: [],
  previousDeclarationSummary: "",
  haveCurrentDeclarations: "",
  currentDeclarations: [],
  currentDeclarationSummary: "",
  compliments: "",
  haveCovidDeclarations: "",
  covidDeclarationDto: null,
  lifecycleState: LifeCycleState.New,
  submissionDate: "",
  lastModifiedDate: "",
  isDeclarationAccepted: false,
  isConsentAccepted: false
};

export const initialState: IFormB = {
  formBData: initialFormState,
  sectionNumber: 1,
  previousSectionNumber: null,
  status: "idle",
  error: "",
  saveBtnActive: false
};

export const loadSavedFormB = createAsyncThunk(
  "formB/fetchFormB",
  async (formId: string) => {
    const formsService = new FormsService();
    const response: AxiosResponse<FormRPartB> =
      await formsService.getTraineeFormRPartBByFormId(formId);
    return response.data;
  }
);

export const saveFormB = createAsyncThunk(
  "formB/saveFormB",
  async (form: FormRPartB) => {
    const formsService = new FormsService();
    return await formsService.saveTraineeFormRPartB(form);
  }
);

export const updateFormB = createAsyncThunk(
  "formB/updateForm",
  async (form: FormRPartB) => {
    const formsService = new FormsService();
    return await formsService.updateTraineeFormRPartB(form);
  }
);

const formBSlice = createSlice({
  name: "formB",
  initialState,
  reducers: {
    resetToInitFormB() {
      return initialState;
    },
    updatedFormB(state, action: PayloadAction<FormRPartB>) {
      return { ...state, formBData: action.payload };
    },
    decrementFormBSection: state => {
      state.sectionNumber -= 1;
    },
    incrementFormBSection: state => {
      state.sectionNumber += 1;
    },
    updateFormBSection(state, action: PayloadAction<number>) {
      return { ...state, sectionNumber: action.payload };
    },
    updateFormBPreviousSection(state, action: PayloadAction<number | null>) {
      return { ...state, previousSectionNumber: action.payload };
    },
    updatesaveBtnActive: state => {
      state.saveBtnActive = !state.saveBtnActive;
    }
  },
  extraReducers(builder): void {
    builder
      .addCase(loadSavedFormB.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(loadSavedFormB.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.formBData = action.payload;
      })
      .addCase(loadSavedFormB.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(saveFormB.pending, (state, _action) => {
        state.status = "saving";
      })
      .addCase(saveFormB.fulfilled, (state, _action) => {
        state.status = "succeeded";
      })
      .addCase(saveFormB.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateFormB.pending, (state, _action) => {
        state.status = "updating";
      })
      .addCase(updateFormB.fulfilled, (state, _action) => {
        state.status = "succeeded";
      })
      .addCase(updateFormB.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export default formBSlice.reducer;

export const {
  resetToInitFormB,
  updatedFormB,
  decrementFormBSection,
  incrementFormBSection,
  updateFormBSection,
  updateFormBPreviousSection,
  updatesaveBtnActive
} = formBSlice.actions;

export const selectSavedFormB = (state: { formB: IFormB }) =>
  state.formB.formBData;

export const selectSaveBtnActive = (state: { formB: IFormB }) =>
  state.formB.saveBtnActive;
