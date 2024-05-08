import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import {
  FormRPartB,
  initialFormRBBeforeProfileData
} from "../../models/FormRPartB";
import { IFormR } from "../../models/IFormR";
import { FormsService } from "../../services/FormsService";
import { toastErrText, toastSuccessText } from "../../utilities/Constants";
import { ToastType, showToast } from "../../components/common/ToastMessage";
import { AutosaveStatusProps } from "../../components/forms/AutosaveMessage";
import { DateUtilities } from "../../utilities/DateUtilities";
import store from "../store/store";
interface IFormB {
  formBList: IFormR[];
  formData: FormRPartB;
  sectionNumber: number;
  previousSectionNumber: number | null;
  status: string;
  error: any;
  saveBtnActive: boolean;
  editPageNumber: number;
  canEdit: boolean;
  autosaveStatus: AutosaveStatusProps;
  autoSaveLatestTimeStamp: string;
  isDirty: boolean;
  displayCovid: boolean;
}

export const defaultCovidObject = {
  selfRateForCovid: "",
  reasonOfSelfRate: "",
  otherInformationForPanel: "",
  discussWithSupervisorChecked: null,
  discussWithSomeoneChecked: null,
  haveChangesToPlacement: null,
  changeCircumstances: "",
  changeCircumstanceOther: "",
  howPlacementAdjusted: "",
  educationSupervisorName: "",
  educationSupervisorEmail: ""
};

export const initialState: IFormB = {
  formBList: [],
  formData: initialFormRBBeforeProfileData,
  sectionNumber: 1,
  previousSectionNumber: null,
  status: "idle",
  error: "",
  saveBtnActive: false,
  editPageNumber: 0,
  canEdit: false,
  autosaveStatus: "idle",
  autoSaveLatestTimeStamp: "none this session",
  isDirty: false,
  displayCovid: false
};

export const loadFormBList = createAsyncThunk(
  "formB/fetchFormBList",
  async () => {
    const formsService = new FormsService();
    const response: AxiosResponse<IFormR[]> =
      await formsService.getTraineeFormRPartBList();
    return DateUtilities.genericSort(response.data, "submissionDate", true);
  }
);

export const loadSavedFormB = createAsyncThunk(
  "formB/fetchFormB",
  async (formId: string) => {
    const state = store.getState();
    // Grab the Covid flag status from the feature flags slice to use to deterimine if the Covid section should be displayed and if a default Covid object should be added to the form data
    const covidFlagStatus =
      state.featureFlags.featureFlags.formRPartB.covidDeclaration;
    const formsService = new FormsService();
    const response = (await formsService.getTraineeFormRPartBByFormId(formId))
      .data;
    return { response, covidFlagStatus };
  }
);

export const saveFormB = createAsyncThunk(
  "formB/saveFormB",
  async (form: FormRPartB) => {
    const formsService = new FormsService();
    return formsService.saveTraineeFormRPartB(form);
  }
);

export const updateFormB = createAsyncThunk(
  "formB/updateFormB",
  async (form: FormRPartB) => {
    const formsService = new FormsService();
    return formsService.updateTraineeFormRPartB(form);
  }
);

export const autoSaveFormB = createAsyncThunk(
  "formB/autoSaveFormB",
  async (form: FormRPartB) => {
    const formsService = new FormsService();
    return (await formsService.saveTraineeFormRPartB(form)).data;
  }
);

export const autoUpdateFormB = createAsyncThunk(
  "formB/autoUpdateFormB",
  async (form: FormRPartB) => {
    const formsService = new FormsService();
    return (await formsService.updateTraineeFormRPartB(form)).data;
  }
);

export const deleteFormB = createAsyncThunk(
  "formB/deleteFormB",
  async (formId: string) => {
    const formsService = new FormsService();
    return formsService.deleteTraineeFormRPartB(formId);
  }
);

const formBSlice = createSlice({
  name: "formB",
  initialState,
  reducers: {
    resetToInitFormB(state) {
      return { ...initialState, formBList: state.formBList };
    },
    updatedFormB(state, action: PayloadAction<FormRPartB>) {
      return { ...state, formData: action.payload };
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
    },
    updatedEditPageNumberB(state, action: PayloadAction<number>) {
      return { ...state, editPageNumber: action.payload };
    },
    updatedCanEditB(state, action: PayloadAction<boolean>) {
      return { ...state, canEdit: action.payload };
    },
    updatedAutosaveStatus(state, action: PayloadAction<AutosaveStatusProps>) {
      return { ...state, autosaveStatus: action.payload };
    },
    updatedAutoSaveLatestTimeStamp(state, action: PayloadAction<string>) {
      return { ...state, autoSaveLatestTimeStamp: action.payload };
    },
    updatedIsDirty(state, action: PayloadAction<boolean>) {
      return { ...state, isDirty: action.payload };
    },
    updatedFormBStatus(state, action: PayloadAction<string>) {
      return { ...state, status: action.payload };
    },
    updatedFormBList(state, action: PayloadAction<IFormR[]>) {
      return { ...state, formBList: action.payload };
    },
    updatedDisplayCovid(state, action: PayloadAction<boolean>) {
      return { ...state, displayCovid: action.payload };
    }
  },
  extraReducers(builder): void {
    builder
      .addCase(loadFormBList.pending, state => {
        state.status = "loading";
      })
      .addCase(loadFormBList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.formBList = action.payload;
      })
      .addCase(loadFormBList.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.fetchForms,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      })
      .addCase(loadSavedFormB.pending, state => {
        state.status = "loading";
      })
      .addCase(loadSavedFormB.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.formData =
          action.payload.covidFlagStatus &&
          action.payload.response.haveCovidDeclarations === null
            ? {
                ...action.payload.response,
                covidDeclarationDto: defaultCovidObject
              }
            : action.payload.response;
        state.displayCovid =
          action.payload.covidFlagStatus ||
          action.payload.response.haveCovidDeclarations !== null;
      })
      .addCase(loadSavedFormB.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.loadSavedFormB,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      })
      .addCase(saveFormB.pending, state => {
        state.status = "saving";
      })
      .addCase(saveFormB.fulfilled, state => {
        state.status = "succeeded";
        showToast(toastSuccessText.saveFormB, ToastType.SUCCESS);
      })
      .addCase(saveFormB.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.saveFormB,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      })
      .addCase(updateFormB.pending, state => {
        state.status = "updating";
      })
      .addCase(updateFormB.fulfilled, state => {
        state.status = "succeeded";
        showToast(toastSuccessText.updateFormB, ToastType.SUCCESS);
      })
      .addCase(updateFormB.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.updateFormB,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      })
      .addCase(autoSaveFormB.pending, state => {
        state.autosaveStatus = "saving";
      })
      .addCase(autoSaveFormB.fulfilled, (state, action) => {
        state.autosaveStatus = "succeeded";
        state.formData = action.payload;
        state.autoSaveLatestTimeStamp = DateUtilities.ConvertToLondonTime(
          action.payload.lastModifiedDate,
          true
        );
      })
      .addCase(autoSaveFormB.rejected, state => {
        state.autosaveStatus = "failed";
      })
      .addCase(autoUpdateFormB.pending, state => {
        state.autosaveStatus = "saving";
      })
      .addCase(autoUpdateFormB.fulfilled, (state, action) => {
        state.autosaveStatus = "succeeded";
        state.formData = action.payload;
        state.autoSaveLatestTimeStamp = DateUtilities.ConvertToLondonTime(
          action.payload.lastModifiedDate,
          true
        );
      })
      .addCase(autoUpdateFormB.rejected, state => {
        state.autosaveStatus = "failed";
      })
      .addCase(deleteFormB.pending, (state, _action) => {
        state.status = "deleting";
      })
      .addCase(deleteFormB.fulfilled, (state, _action) => {
        state.status = "succeeded";
        showToast(toastSuccessText.deleteFormB, ToastType.SUCCESS);
      })
      .addCase(deleteFormB.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.deleteFormB,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
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
  updatesaveBtnActive,
  updatedEditPageNumberB,
  updatedCanEditB,
  updatedAutosaveStatus,
  updatedAutoSaveLatestTimeStamp,
  updatedIsDirty,
  updatedFormBStatus,
  updatedFormBList,
  updatedDisplayCovid
} = formBSlice.actions;

export const selectSavedFormB = (state: { formB: IFormB }) =>
  state.formB.formData;

export const selectSaveBtnActive = (state: { formB: IFormB }) =>
  state.formB.saveBtnActive;

export const selectCanEditStatusB = (state: { formB: IFormB }) =>
  state.formB.canEdit;
