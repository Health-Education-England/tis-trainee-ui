import { ActionType, ReferenceDataState } from "../types";
import {
  LOAD_REFERENCE_GENDER_SUCCESS,
  LOAD_REFERENCE_GENDER_FAILURE,
  LOAD_REFERENCE_COLLEGES_SUCCESS,
  LOAD_REFERENCE_COLLEGES_FAILURE,
  LOAD_REFERENCE_DESIGNATED_BODIES_FAILURE,
  LOAD_REFERENCE_DESIGNATED_BODIES_SUCCESS,
  LOAD_REFERENCE_LOCAL_OFFICES_FAILURE,
  LOAD_REFERENCE_LOCAL_OFFICES_SUCCESS,
  LOAD_REFERENCE_GRADES_SUCCESS,
  LOAD_REFERENCE_GRADES_FAILURE,
  LOAD_REFERENCE_IMMIGRATION_STATUS_SUCCESS,
  LOAD_REFERENCE_IMMIGRATION_STATUS_FAILURE,
  LOAD_REFERENCE_CURRICULA_FAILURE,
  LOAD_REFERENCE_CURRICULA_SUCCESS
} from "../action_types";

const initialState: ReferenceDataState = {
  genders: [],
  colleges: [],
  designatedBodies: [],
  localOffices: [],
  grades: [],
  immigrationStatus: [],
  curricula: [],
  isLoaded: false
};

export default function ReferenceDataReducer(
  state: ReferenceDataState = initialState,
  action: ActionType = {
    type: "",
    payload: ""
  }
): ReferenceDataState {
  switch (action.type) {
    case LOAD_REFERENCE_GENDER_SUCCESS:
      return {
        ...state,
        genders: action.payload,
        isLoaded: true
      };

    case LOAD_REFERENCE_COLLEGES_SUCCESS:
      return {
        ...state,
        colleges: action.payload,
        isLoaded: true
      };

    case LOAD_REFERENCE_DESIGNATED_BODIES_SUCCESS:
      return {
        ...state,
        designatedBodies: action.payload,
        isLoaded: true
      };

    case LOAD_REFERENCE_LOCAL_OFFICES_SUCCESS:
      return {
        ...state,
        localOffices: action.payload,
        isLoaded: true
      };

    case LOAD_REFERENCE_GRADES_SUCCESS:
      return {
        ...state,
        grades: action.payload,
        isLoaded: true
      };

    case LOAD_REFERENCE_IMMIGRATION_STATUS_SUCCESS:
      return {
        ...state,
        immigrationStatus: action.payload,
        isLoaded: true
      };

    case LOAD_REFERENCE_CURRICULA_SUCCESS:
      return {
        ...state,
        curricula: action.payload,
        isLoaded: true
      };

    case LOAD_REFERENCE_GENDER_FAILURE:
    case LOAD_REFERENCE_COLLEGES_FAILURE:
    case LOAD_REFERENCE_DESIGNATED_BODIES_FAILURE:
    case LOAD_REFERENCE_LOCAL_OFFICES_FAILURE:
    case LOAD_REFERENCE_GRADES_FAILURE:
    case LOAD_REFERENCE_IMMIGRATION_STATUS_FAILURE:
    case LOAD_REFERENCE_CURRICULA_FAILURE:
      return {
        ...state,
        isLoaded: false
      };

    default:
      return state;
  }
}
