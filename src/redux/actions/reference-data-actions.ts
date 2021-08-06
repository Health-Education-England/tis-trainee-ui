import { ActionType } from "../types";
import {
  LOAD_REFERENCE_GENDER_SUCCESS,
  LOAD_REFERENCE_GENDER_FAILURE,
  LOAD_REFERENCE_COLLEGES_SUCCESS,
  LOAD_REFERENCE_COLLEGES_FAILURE,
  LOAD_REFERENCE_DESIGNATED_BODIES_SUCCESS,
  LOAD_REFERENCE_DESIGNATED_BODIES_FAILURE,
  LOAD_REFERENCE_LOCAL_OFFICES_SUCCESS,
  LOAD_REFERENCE_LOCAL_OFFICES_FAILURE,
  LOAD_REFERENCE_GRADES_SUCCESS,
  LOAD_REFERENCE_GRADES_FAILURE,
  LOAD_REFERENCE_IMMIGRATION_STATUS_SUCCESS,
  LOAD_REFERENCE_IMMIGRATION_STATUS_FAILURE,
  LOAD_REFERENCE_CURRICULA_SUCCESS,
  LOAD_REFERENCE_CURRICULA_FAILURE
} from "../action_types";
import { TraineeReferenceService } from "../../services/TraineeReferenceService";
import { KeyValue } from "../../models/KeyValue";
import { AxiosResponse } from "axios";

export const loadReferenceData =
  (referenceService: TraineeReferenceService) =>
  (dispatch: (action: ActionType) => any) => {
    const genders = referenceService
      .getGenders()
      .then(response => {
        dispatch({
          type: LOAD_REFERENCE_GENDER_SUCCESS,
          payload: getKeyValuesFromResponse(response)
        });
      })
      .catch(error =>
        dispatch({
          type: LOAD_REFERENCE_GENDER_FAILURE,
          payload: error
        })
      );

    const colleges = referenceService
      .getColleges()
      .then(response => {
        dispatch({
          type: LOAD_REFERENCE_COLLEGES_SUCCESS,
          payload: getKeyValuesFromResponse(response)
        });
      })
      .catch(error =>
        dispatch({
          type: LOAD_REFERENCE_COLLEGES_FAILURE,
          payload: error
        })
      );

    const designatedBodies = referenceService
      .getDesignatedBodies()
      .then(response => {
        dispatch({
          type: LOAD_REFERENCE_DESIGNATED_BODIES_SUCCESS,
          payload: getKeyValuesFromResponse(response)
        });
      })
      .catch(error =>
        dispatch({
          type: LOAD_REFERENCE_DESIGNATED_BODIES_FAILURE,
          payload: error
        })
      );

    const localOffices = referenceService
      .getLocalOffices()
      .then(response => {
        dispatch({
          type: LOAD_REFERENCE_LOCAL_OFFICES_SUCCESS,
          payload: getKeyValuesFromResponse(response)
        });
      })
      .catch(error =>
        dispatch({
          type: LOAD_REFERENCE_LOCAL_OFFICES_FAILURE,
          payload: error
        })
      );

    const trainingGrades = referenceService
      .getTrainingGrades()
      .then(response => {
        dispatch({
          type: LOAD_REFERENCE_GRADES_SUCCESS,
          payload: getKeyValuesFromResponse(response)
        });
      })
      .catch(error =>
        dispatch({
          type: LOAD_REFERENCE_GRADES_FAILURE,
          payload: error
        })
      );

    const immigrationStatus = referenceService
      .getImmigrationStatus()
      .then(response => {
        dispatch({
          type: LOAD_REFERENCE_IMMIGRATION_STATUS_SUCCESS,
          payload: getKeyValuesFromResponse(response)
        });
      })
      .catch(error =>
        dispatch({
          type: LOAD_REFERENCE_IMMIGRATION_STATUS_FAILURE,
          payload: error
        })
      );

    const curricule = referenceService
      .getCurricula()
      .then(response => {
        dispatch({
          type: LOAD_REFERENCE_CURRICULA_SUCCESS,
          payload: getKeyValuesFromResponse(response)
        });
      })
      .catch(error =>
        dispatch({
          type: LOAD_REFERENCE_CURRICULA_FAILURE,
          payload: error
        })
      );

    return [
      genders,
      colleges,
      immigrationStatus,
      designatedBodies,
      localOffices,
      trainingGrades,
      curricule
    ];
  };

function getKeyValuesFromResponse(response: AxiosResponse<any[]>): KeyValue[] {
  return response.data.map<KeyValue>(d => {
    return {
      tisId: d.tisId,
      label: d.label,
      value: d.label,
      curriculumSubType: d.curriculumSubType
    };
  });
}
