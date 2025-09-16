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
import { SaveStatusProps } from "../../components/forms/AutosaveMessage";
import { DateUtilities } from "../../utilities/DateUtilities";
import { RootState } from "../store/store";
import { LinkedFormRDataType } from "../../components/forms/form-linker/FormLinkerForm";
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
  saveStatus: SaveStatusProps;
  saveLatestTimeStamp: string;
  isDirty: boolean;
  displayCovid: boolean;
  newFormId: string | undefined;
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
  saveStatus: "idle",
  saveLatestTimeStamp: "none this session",
  isDirty: false,
  displayCovid: false,
  newFormId: undefined
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

type ReturnedLoadSavedFormB = {
  finalForm: FormRPartB;
  covidFlagStatus: boolean;
};

export const loadSavedFormB = createAsyncThunk(
  "formB/fetchFormB",
  async (
    {
      id,
      linkedFormRData
    }: {
      id: string;
      linkedFormRData?: LinkedFormRDataType;
    },
    { getState }
  ): Promise<ReturnedLoadSavedFormB> => {
    const state = getState() as RootState;
    const covidFlagStatus =
      state.featureFlags.featureFlags.formRPartB.covidDeclaration;
    const formsService = new FormsService();
    const fetchedForm = (await formsService.getTraineeFormRPartBByFormId(id))
      .data;
    let finalForm: FormRPartB = fetchedForm;
    if (linkedFormRData) {
      finalForm = {
        ...fetchedForm,
        isArcp: linkedFormRData.isArcp,
        programmeMembershipId: linkedFormRData.programmeMembershipId,
        programmeName: linkedFormRData?.linkedProgramme?.programmeName,
        localOfficeName: linkedFormRData.localOfficeName,
        programmeSpecialty: linkedFormRData.linkedProgramme?.programmeName
      };
    }
    return {
      finalForm,
      covidFlagStatus
    };
  }
);

export const saveFormB = createAsyncThunk(
  "formB/saveFormB",
  async (
    {
      formData,
      isAutoSave,
      isSubmit
    }: { formData: FormRPartB; isAutoSave: boolean; isSubmit: boolean },
    { rejectWithValue }
  ) => {
    const formsService = new FormsService();
    try {
      const response = await formsService.saveTraineeFormRPartB(formData);
      return { data: response.data, isAutoSave, isSubmit };
    } catch (error) {
      return rejectWithValue({ error, isAutoSave, isSubmit });
    }
  }
);

export const updateFormB = createAsyncThunk(
  "formB/updateFormB",
  async (
    {
      formData,
      isAutoSave,
      isSubmit
    }: { formData: FormRPartB; isAutoSave: boolean; isSubmit: boolean },
    { rejectWithValue }
  ) => {
    const formsService = new FormsService();
    try {
      const response = await formsService.updateTraineeFormRPartB(formData);
      return { data: response.data, isAutoSave, isSubmit };
    } catch (error) {
      return rejectWithValue({ error, isAutoSave, isSubmit });
    }
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
    updatedSaveStatusB(state, action: PayloadAction<SaveStatusProps>) {
      return { ...state, saveStatus: action.payload };
    },
    updatedSaveLatestTimeStamp(state, action: PayloadAction<string>) {
      return { ...state, saveLatestTimeStamp: action.payload };
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
          action.payload.finalForm.haveCovidDeclarations === null
            ? {
                ...action.payload.finalForm,
                covidDeclarationDto: defaultCovidObject
              }
            : action.payload.finalForm;
        state.displayCovid =
          action.payload.covidFlagStatus ||
          action.payload.finalForm.haveCovidDeclarations !== null;
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
      .addCase(
        saveFormB.pending,
        (
          state,
          {
            meta: {
              arg: { isAutoSave }
            }
          }
        ) => {
          if (isAutoSave) state.saveStatus = "saving";
        }
      )
      .addCase(
        saveFormB.fulfilled,
        (state, { payload: { data, isAutoSave, isSubmit } }) => {
          state.saveStatus = "succeeded";
          state.formData = data;
          state.newFormId = data.id;
          if (isAutoSave)
            state.saveLatestTimeStamp = DateUtilities.ConvertToLondonTime(
              data.lastModifiedDate,
              true
            );
          if (isSubmit) {
            showToast(toastSuccessText.submitFormB, ToastType.SUCCESS);
          }
          if (!isAutoSave && !isSubmit) {
            showToast(toastSuccessText.saveFormB, ToastType.SUCCESS);
          }
        }
      )
      .addCase(saveFormB.rejected, (state, action) => {
        const { error, isAutoSave, isSubmit } = action.payload as {
          error: any;
          isAutoSave: boolean;
          isSubmit: boolean;
        };
        state.saveStatus = "failed";
        state.error = error.message;
        if (isSubmit) {
          showToast(
            toastErrText.submitFormB,
            ToastType.ERROR,
            `${error.code}-${error.message}`
          );
        }
        if (!isAutoSave && !isSubmit) {
          showToast(
            toastErrText.saveFormB,
            ToastType.ERROR,
            `${error.code}-${error.message}`
          );
        }
      })
      .addCase(
        updateFormB.pending,
        (
          state,
          {
            meta: {
              arg: { isAutoSave }
            }
          }
        ) => {
          if (isAutoSave) state.saveStatus = "saving";
        }
      )
      .addCase(
        updateFormB.fulfilled,
        (state, { payload: { data, isAutoSave, isSubmit } }) => {
          state.saveStatus = "succeeded";
          state.formData = data;
          if (isAutoSave)
            state.saveLatestTimeStamp = DateUtilities.ConvertToLondonTime(
              data.lastModifiedDate,
              true
            );
          if (isSubmit) {
            showToast(toastSuccessText.submitFormB, ToastType.SUCCESS);
          }
          if (!isAutoSave && !isSubmit) {
            showToast(toastSuccessText.updateFormB, ToastType.SUCCESS);
          }
        }
      )
      .addCase(updateFormB.rejected, (state, action) => {
        const { error, isAutoSave, isSubmit } = action.payload as {
          error: any;
          isAutoSave: boolean;
          isSubmit: boolean;
        };
        state.saveStatus = "failed";
        state.error = error.message;
        if (isSubmit) {
          showToast(
            toastErrText.submitFormB,
            ToastType.ERROR,
            `${error.code}-${error.message}`
          );
        }
        if (!isAutoSave && !isSubmit) {
          showToast(
            toastErrText.updateFormB,
            ToastType.ERROR,
            `${error.code}-${error.message}`
          );
        }
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
  updatedSaveStatusB,
  updatedSaveLatestTimeStamp,
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
