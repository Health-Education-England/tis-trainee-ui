import { ActionType } from "../../components/common/ActionModal";
import { FormName } from "../../components/forms/form-builder/FormBuilder";
import {
  unsubmitLtftForm,
  withdrawLtftForm
} from "../../redux/slices/ltftSlice";
import store from "../../redux/store/store";
import { isFormDeleted } from "../FormBuilderUtilities";
import * as LtftUtilities from "../ltftUtilities";

jest.mock("../../redux/store/store", () => ({
  __esModule: true,
  default: {
    dispatch: jest.fn().mockResolvedValue(true)
  }
}));

jest.mock("../FormBuilderUtilities", () => ({
  __esModule: true,
  isFormDeleted: jest.fn().mockResolvedValue(true)
}));

jest.mock("../../redux/slices/ltftSlice", () => ({
  __esModule: true,
  unsubmitLtftForm: jest.fn().mockReturnValue("UNSUBMIT_ACTION"),
  withdrawLtftForm: jest.fn().mockReturnValue("WITHDRAW_ACTION")
}));

describe("handleLtftSummaryModalSub", () => {
  const currentAction = {
    type: "Delete" as ActionType,
    id: "123",
    warningText: "Warning text",
    submittingText: "Submitting text",
    formName: "ltft" as FormName
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call isFormDeleted when action type is Delete", async () => {
    const result = await LtftUtilities.handleLtftSummaryModalSub(currentAction);

    expect(isFormDeleted).toHaveBeenCalledWith("ltft", "123");
    expect(result).toBe(true);
  });

  it("should dispatch unsubmitLtftForm when action type is Unsubmit", async () => {
    const currentActionUnsub = {
      ...currentAction,
      type: "Unsubmit" as ActionType
    };
    const reasonObj = { reason: "other reason", message: "Some unsub message" };

    const result = await LtftUtilities.handleLtftSummaryModalSub(
      currentActionUnsub,
      reasonObj
    );

    expect(unsubmitLtftForm).toHaveBeenCalledWith({
      id: "123",
      reasonObj
    });
    expect(store.dispatch).toHaveBeenCalledWith("UNSUBMIT_ACTION");
    expect(result).toBe(true);
  });

  it("should dispatch withdrawLtftForm when action type is Withdraw", async () => {
    const currentActionWithdraw = {
      ...currentAction,
      type: "Withdraw" as ActionType
    };
    const reasonObj = {
      reason: "other reason",
      message: "Some withdraw message"
    };

    const result = await LtftUtilities.handleLtftSummaryModalSub(
      currentActionWithdraw,
      reasonObj
    );

    expect(withdrawLtftForm).toHaveBeenCalledWith({
      id: "123",
      reasonObj
    });
    expect(store.dispatch).toHaveBeenCalledWith("WITHDRAW_ACTION");
    expect(result).toBe(true);
  });

  it("should return false if action type is not handled", async () => {
    const currentActionOther = {
      ...currentAction,
      type: "Save" as ActionType
    };

    const result = await LtftUtilities.handleLtftSummaryModalSub(
      currentActionOther
    );

    expect(result).toBe(false);
  });
});
