import { ActionType, FormRPartAViewState, FormRPartAListState } from "../types";
import {
  UPDATE_FORMR_PARTA,
  LOAD_FORMR_PARTA_LIST_SUCCESS,
  LOAD_FORMR_PARTA_LIST_FAILURE,
  INITIALIZE_FORMR_PARTA_SUCCESS,
  INITIALIZE_FORMR_PARTA_FAILURE
} from "../action_types";

const formRPartAViewState: FormRPartAViewState = {
  formData: null
};

export function FormRPartAReducer(
  state = formRPartAViewState,
  action: ActionType
): FormRPartAViewState {
  switch (action.type) {
    case INITIALIZE_FORMR_PARTA_SUCCESS:
      return {
        ...state,
        formData: action.payload
      };
    case INITIALIZE_FORMR_PARTA_FAILURE:
      return {
        ...state,
        formData: null
      };
    case UPDATE_FORMR_PARTA:
      return {
        ...state,
        formData: action.payload
      };
    default:
      return state;
  }
}

const formRPartAListState: FormRPartAListState = {
  submittedForms: []
};

export function FormRPartAListReducer(
  state = formRPartAListState,
  action: ActionType
): FormRPartAListState {
  switch (action.type) {
    case LOAD_FORMR_PARTA_LIST_SUCCESS:
      return {
        ...state,
        submittedForms: action.payload
      };
    case LOAD_FORMR_PARTA_LIST_FAILURE:
      return {
        ...state,
        submittedForms: []
      };
    default:
      return state;
  }
}
