import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import {
  FormRPartA,
  initialFormRABeforeProfileData
} from "../../models/FormRPartA";
import { IFormR } from "../../models/IFormR";
import { FormsService } from "../../services/FormsService";
import { toastErrText, toastSuccessText } from "../../utilities/Constants";
import { ToastType, showToast } from "../../components/common/ToastMessage";
import { SaveStatusProps } from "../../components/forms/AutosaveMessage";
import { DateUtilities } from "../../utilities/DateUtilities";
import { LinkedFormRDataType } from "../../components/forms/form-linker/FormLinkerForm";
import { LifeCycleState } from "../../models/LifeCycleState";
interface IFormA {
  formAList: IFormR[];
  formData: FormRPartA;
  status: string;
  error: any;
  editPageNumber: number;
  canEdit: boolean;
  saveStatus: SaveStatusProps;
  saveLatestTimeStamp: string;
  newFormId: string | undefined;
}

export const initialState: IFormA = {
  formAList: [],
  formData: initialFormRABeforeProfileData,
  status: "idle",
  error: "",
  editPageNumber: 0,
  canEdit: false,
  saveStatus: "idle",
  saveLatestTimeStamp: "none this session",
  newFormId: undefined
};

export const loadFormAList = createAsyncThunk(
  "formA/fetchFormAList",
  async () => {
    const formsService = new FormsService();
    const response: AxiosResponse<IFormR[]> =
      await formsService.getTraineeFormRPartAList();
    return DateUtilities.genericSort(response.data, "submissionDate", true);
  }
);

export const loadSavedFormA = createAsyncThunk(
  "formA/fetchFormA",
  async ({
    id,
    linkedFormRData
  }: {
    id: string;
    linkedFormRData?: LinkedFormRDataType;
  }): Promise<FormRPartA> => {
    const formsService = new FormsService();
    const fetchedForm = (await formsService.getTraineeFormRPartAByFormId(id))
      .data;
    if (linkedFormRData) {
      return {
        ...fetchedForm,
        isArcp: linkedFormRData.isArcp,
        programmeMembershipId: linkedFormRData.programmeMembershipId,
        localOfficeName: linkedFormRData.localOfficeName,
        programmeSpecialty: linkedFormRData.linkedProgramme?.programmeName
      };
    }
    return fetchedForm;
  }
);

export const saveFormA = createAsyncThunk(
  "formA/saveFormA",
  async (
    {
      formData,
      isAutoSave,
      isSubmit
    }: {
      formData: FormRPartA;
      isAutoSave: boolean;
      isSubmit: boolean;
    },
    { rejectWithValue }
  ) => {
    const formsService = new FormsService();
    try {
      const response = await formsService.saveTraineeFormRPartA(formData);
      return { data: response.data, isAutoSave, isSubmit };
    } catch (error) {
      return rejectWithValue({ error, isAutoSave, isSubmit });
    }
  }
);

export const updateFormA = createAsyncThunk(
  "formA/updateFormA",
  async (
    {
      formData,
      isAutoSave,
      isSubmit
    }: {
      formData: FormRPartA;
      isAutoSave: boolean;
      isSubmit: boolean;
    },
    { rejectWithValue }
  ) => {
    const formsService = new FormsService();
    try {
      const response = await formsService.updateTraineeFormRPartA(formData);
      return { data: response.data, isAutoSave, isSubmit };
    } catch (error) {
      return rejectWithValue({ error, isAutoSave, isSubmit });
    }
  }
);

export const deleteFormA = createAsyncThunk(
  "formA/deleteFormA",
  async (formId: string) => {
    const formsService = new FormsService();
    return formsService.deleteTraineeFormRPartA(formId);
  }
);

const formASlice = createSlice({
  name: "formA",
  initialState,
  reducers: {
    resetToInitFormA(state) {
      return { ...initialState, formAList: state.formAList };
    },
    updatedFormA(state, action: PayloadAction<FormRPartA>) {
      return { ...state, formData: action.payload };
    },
    updatedEditPageNumber(state, action: PayloadAction<number>) {
      return { ...state, editPageNumber: action.payload };
    },
    updatedCanEdit(state, action: PayloadAction<boolean>) {
      return { ...state, canEdit: action.payload };
    },
    updatedSaveStatus(state, action: PayloadAction<SaveStatusProps>) {
      return { ...state, saveStatus: action.payload };
    },
    updatedSaveLatestTimeStamp(state, action: PayloadAction<string>) {
      return { ...state, saveLatestTimeStamp: action.payload };
    },
    updatedFormAStatus(state, action: PayloadAction<string>) {
      return { ...state, status: action.payload };
    },
    updatedFormAList(state, action: PayloadAction<IFormR[]>) {
      return { ...state, formAList: action.payload };
    },
    updatedNewFormId(state, action: PayloadAction<string>) {
      return { ...state, newFormId: action.payload };
    },
    updatedFormALifecycleState(state, action: PayloadAction<LifeCycleState>) {
      return {
        ...state,
        formData: { ...state.formData, lifecycleState: action.payload }
      };
    }
  },
  extraReducers(builder): void {
    builder
      .addCase(loadFormAList.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(loadFormAList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.formAList = action.payload;
      })
      .addCase(loadFormAList.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.fetchForms,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      })
      .addCase(loadSavedFormA.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(loadSavedFormA.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.formData = action.payload;
      })
      .addCase(loadSavedFormA.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.loadSavedFormA,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      })
      .addCase(
        saveFormA.pending,
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
        saveFormA.fulfilled,
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
            showToast(toastSuccessText.submitFormA, ToastType.SUCCESS);
          }
          if (!isAutoSave && !isSubmit) {
            showToast(toastSuccessText.saveFormA, ToastType.SUCCESS);
          }
        }
      )
      .addCase(saveFormA.rejected, (state, action) => {
        const { error, isAutoSave, isSubmit } = action.payload as {
          error: any;
          isAutoSave: boolean;
          isSubmit: boolean;
        };
        state.saveStatus = "failed";
        state.error = error.message;
        if (isSubmit) {
          showToast(
            toastErrText.submitFormA,
            ToastType.ERROR,
            `${error.code}-${error.message}`
          );
        }
        if (!isAutoSave && !isSubmit) {
          showToast(
            toastErrText.saveFormA,
            ToastType.ERROR,
            `${error.code}-${error.message}`
          );
        }
      })
      .addCase(
        updateFormA.pending,
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
        updateFormA.fulfilled,
        (state, { payload: { data, isAutoSave, isSubmit } }) => {
          state.saveStatus = "succeeded";
          state.formData = data;
          if (isAutoSave)
            state.saveLatestTimeStamp = DateUtilities.ConvertToLondonTime(
              data.lastModifiedDate,
              true
            );
          if (isSubmit) {
            showToast(toastSuccessText.submitFormA, ToastType.SUCCESS);
          }
          if (!isAutoSave && !isSubmit) {
            showToast(toastSuccessText.updateFormA, ToastType.SUCCESS);
          }
        }
      )
      .addCase(updateFormA.rejected, (state, action) => {
        const { error, isAutoSave, isSubmit } = action.payload as {
          error: any;
          isAutoSave: boolean;
          isSubmit: boolean;
        };
        state.saveStatus = "failed";
        state.error = error.message;
        if (isSubmit) {
          showToast(
            toastErrText.submitFormA,
            ToastType.ERROR,
            `${error.code}-${error.message}`
          );
        }
        if (!isAutoSave && !isSubmit) {
          showToast(
            toastErrText.updateFormA,
            ToastType.ERROR,
            `${error.code}-${error.message}`
          );
        }
      })
      .addCase(deleteFormA.pending, (state, _action) => {
        state.status = "deleting";
      })
      .addCase(deleteFormA.fulfilled, (state, _action) => {
        state.status = "succeeded";
        showToast(toastSuccessText.deleteFormA, ToastType.SUCCESS);
      })
      .addCase(deleteFormA.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.deleteFormA,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      });
  }
});

export default formASlice.reducer;

export const {
  resetToInitFormA,
  updatedFormA,
  updatedEditPageNumber,
  updatedCanEdit,
  updatedSaveStatus,
  updatedSaveLatestTimeStamp,
  updatedFormAStatus,
  updatedFormAList,
  updatedNewFormId,
  updatedFormALifecycleState
} = formASlice.actions;

export const selectSavedFormA = (state: { formA: IFormA }) =>
  state.formA.formData;

export const selectCanEditStatus = (state: { formA: IFormA }) =>
  state.formA.canEdit;
