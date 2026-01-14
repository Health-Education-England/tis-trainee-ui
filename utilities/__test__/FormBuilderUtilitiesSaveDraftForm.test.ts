import { saveDraftForm } from "../FormBuilderUtilities";
import store from "../../redux/store/store";
import history from "../../components/navigation/history";
import { FormRPartA } from "../../models/FormRPartA";
import { FormRPartB } from "../../models/FormRPartB";
import { Form } from "../../components/forms/form-builder/FormBuilder";
import { LifeCycleState } from "../../models/LifeCycleState";

jest.mock("../../redux/store/store", () => ({
  dispatch: jest.fn().mockResolvedValue(undefined),
  getState: jest.fn().mockReturnValue({
    formA: { saveStatus: "succeeded", newFormId: "new-formA-id" },
    formB: { saveStatus: "succeeded", newFormId: "new-formB-id" },
    ltft: { saveStatus: "succeeded", newFormId: "new-ltft-id" },
    traineeProfile: {
      traineeProfileData: {
        programmeMemberships: []
      }
    }
  })
}));

jest.mock("../CctUtilities", () => ({
  findLinkedProgramme: jest.fn().mockImplementation(id => {
    if (id === "pm-123") {
      return {
        programmeMembershipId: "pm-123",
        programmeName: "Test Programme",
        startDate: "2020-01-01",
        endDate: "2025-01-01",
        designatedBodyCode: "DBC",
        managingDeanery: "Deanery"
      };
    }
    return null;
  }),
  calcCctDate: jest.fn()
}));

jest.mock("../../components/navigation/history", () => ({
  push: jest.fn()
}));

jest.mock("../../redux/slices/formASlice", () => ({
  updateFormA: jest.fn(),
  saveFormA: jest.fn()
}));

jest.mock("../../redux/slices/formBSlice", () => ({
  updateFormB: jest.fn(),
  saveFormB: jest.fn()
}));

jest.mock("../../redux/slices/ltftSlice", () => ({
  updateLtft: jest.fn(),
  saveLtft: jest.fn(),
  updatedLtft: jest.fn()
}));

import { updateFormA, saveFormA } from "../../redux/slices/formASlice";
import { updateFormB, saveFormB } from "../../redux/slices/formBSlice";
import { updateLtft, saveLtft } from "../../redux/slices/ltftSlice";
import { LtftObjNew } from "../../models/LtftTypes";

describe("saveDraftForm integration tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const formAJson: Form = {
    name: "formA",
    pages: [],
    declarations: []
  } as Form;
  const formBJson: Form = {
    name: "formB",
    pages: [],
    declarations: []
  } as Form;
  const ltftJson: Form = { name: "ltft", pages: [], declarations: [] } as Form;

  describe("Form A tests", () => {
    it("should call updateFormA when form has an existing ID", async () => {
      const formData: Partial<FormRPartA> = {
        id: "existing-formA-id",
        traineeTisId: "trainee123",
        lifecycleState: LifeCycleState.Draft
      };

      await saveDraftForm(formAJson, formData as FormRPartA);

      expect(updateFormA).toHaveBeenCalledWith({
        formData: expect.objectContaining({
          id: "existing-formA-id",
          traineeTisId: "trainee123",
          lifecycleState: LifeCycleState.Draft,
          lastModifiedDate: expect.any(Date)
        }),
        isAutoSave: false,
        isSubmit: false
      });
      expect(saveFormA).not.toHaveBeenCalled();
      expect(history.push).toHaveBeenCalledWith("/formr-a");
    });

    it("should call saveFormA when form has no existing ID", async () => {
      const formData: Partial<FormRPartA> = {
        traineeTisId: "trainee123",
        lifecycleState: LifeCycleState.Draft
      };

      (store.getState as jest.Mock).mockReturnValueOnce({
        formA: { saveStatus: "succeeded", newFormId: null },
        traineeProfile: { traineeProfileData: { programmeMemberships: [] } }
      });

      await saveDraftForm(formAJson, formData as FormRPartA);

      expect(saveFormA).toHaveBeenCalledWith({
        formData: expect.objectContaining({
          traineeTisId: "trainee123",
          lifecycleState: LifeCycleState.Draft,
          lastModifiedDate: expect.any(Date)
        }),
        isAutoSave: false,
        isSubmit: false
      });
      expect(updateFormA).not.toHaveBeenCalled();
      expect(history.push).toHaveBeenCalledWith("/formr-a");
    });

    it("should prep FormA data differently when isSubmit=true", async () => {
      const formData: Partial<FormRPartA> = {
        id: "existing-formA-id",
        traineeTisId: "trainee123",
        lifecycleState: LifeCycleState.Draft
      };

      await saveDraftForm(formAJson, formData as FormRPartA, false, true);

      expect(updateFormA).toHaveBeenCalledWith({
        formData: expect.objectContaining({
          id: "existing-formA-id",
          traineeTisId: "trainee123",
          lifecycleState: LifeCycleState.Submitted,
          lastModifiedDate: expect.any(Date),
          submissionDate: expect.any(Date)
        }),
        isAutoSave: false,
        isSubmit: true
      });
    });

    it("should maintain Unsubmitted state when current state is Unsubmitted", async () => {
      const formData: Partial<FormRPartA> = {
        id: "existing-formA-id",
        traineeTisId: "trainee123",
        lifecycleState: LifeCycleState.Unsubmitted
      };

      await saveDraftForm(formAJson, formData as FormRPartA);

      expect(updateFormA).toHaveBeenCalledWith(
        expect.objectContaining({
          formData: expect.objectContaining({
            lifecycleState: LifeCycleState.Unsubmitted
          })
        })
      );
    });
  });

  describe("Form B tests", () => {
    it("should call updateFormB when form has an existing ID", async () => {
      const formData: Partial<FormRPartB> = {
        id: "existing-formB-id",
        traineeTisId: "trainee123",
        lifecycleState: LifeCycleState.Draft
      };

      await saveDraftForm(formBJson, formData as FormRPartB);

      expect(updateFormB).toHaveBeenCalledWith({
        formData: expect.objectContaining({
          id: "existing-formB-id",
          traineeTisId: "trainee123",
          lifecycleState: LifeCycleState.Draft,
          lastModifiedDate: expect.any(Date)
        }),
        isAutoSave: false,
        isSubmit: false
      });
      expect(saveFormB).not.toHaveBeenCalled();
      expect(history.push).toHaveBeenCalledWith("/formr-b");
    });

    it("should call saveFormB when form has no existing ID", async () => {
      const formData: Partial<FormRPartB> = {
        traineeTisId: "trainee123",
        lifecycleState: LifeCycleState.Draft
      };

      (store.getState as jest.Mock).mockReturnValueOnce({
        formB: { saveStatus: "succeeded", newFormId: null },
        traineeProfile: { traineeProfileData: { programmeMemberships: [] } }
      });

      await saveDraftForm(formBJson, formData as FormRPartB);

      expect(saveFormB).toHaveBeenCalledWith({
        formData: expect.objectContaining({
          traineeTisId: "trainee123",
          lifecycleState: LifeCycleState.Draft,
          lastModifiedDate: expect.any(Date)
        }),
        isAutoSave: false,
        isSubmit: false
      });
      expect(updateFormB).not.toHaveBeenCalled();
      expect(history.push).toHaveBeenCalledWith("/formr-b");
    });
  });

  describe("LTFT tests", () => {
    it("should call updateLtft when form has an existing ID", async () => {
      const formData: Partial<LtftObjNew> = {
        id: "existing-ltft-id",
        traineeTisId: "trainee123",
        pmId: "pm-123"
      };

      await saveDraftForm(ltftJson, formData as LtftObjNew);

      expect(updateLtft).toHaveBeenCalledWith({
        formData: expect.objectContaining({
          id: "existing-ltft-id",
          traineeTisId: "trainee123",
          pmName: "Test Programme"
        }),
        isAutoSave: false,
        isSubmit: false,
        showFailToastOnly: false
      });
      expect(saveLtft).not.toHaveBeenCalled();
      expect(history.push).toHaveBeenCalledWith("/ltft");
    });

    it("should call saveLtft when form has no existing ID", async () => {
      const formData: Partial<LtftObjNew> = {
        traineeTisId: "trainee123",
        pmId: "pm-123"
      };

      (store.getState as jest.Mock).mockReturnValueOnce({
        ltft: { saveStatus: "succeeded", newFormId: null },
        traineeProfile: { traineeProfileData: { programmeMemberships: [] } }
      });

      await saveDraftForm(ltftJson, formData as LtftObjNew);

      expect(saveLtft).toHaveBeenCalledWith({
        formData: expect.objectContaining({
          traineeTisId: "trainee123"
        }),
        isAutoSave: false,
        isSubmit: false,
        showFailToastOnly: false
      });
      expect(updateLtft).not.toHaveBeenCalled();
      expect(history.push).toHaveBeenCalledWith("/ltft");
    });

    it("should NOT prep LTFT forms (no FormR-specific processing)", async () => {
      const formData: Partial<LtftObjNew> = {
        id: "existing-ltft-id",
        traineeTisId: "trainee123",
        pmId: "pm-123"
      };

      await saveDraftForm(ltftJson, formData as LtftObjNew, false, true);

      expect(updateLtft).toHaveBeenCalledWith({
        formData: expect.objectContaining({
          id: "existing-ltft-id",
          traineeTisId: "trainee123"
        }),
        isAutoSave: false,
        isSubmit: true,
        showFailToastOnly: false
      });
      // LTFT forms don't set submissionDate or change lifecycleState like FormR forms
    });
  });

  describe("Flag parameter tests", () => {
    it("should pass isAutoSave flag to update function", async () => {
      const formData: Partial<FormRPartA> = { id: "test-id" };
      await saveDraftForm(formAJson, formData as FormRPartA, true);

      expect(updateFormA).toHaveBeenCalledWith(
        expect.objectContaining({ isAutoSave: true })
      );
    });

    it("should pass isSubmit flag to update function", async () => {
      const formData: Partial<FormRPartA> = { id: "test-id" };
      await saveDraftForm(formAJson, formData as FormRPartA, false, true);

      expect(updateFormA).toHaveBeenCalledWith(
        expect.objectContaining({ isSubmit: true })
      );
    });

    it("should pass showFailToastOnly flag to update function", async () => {
      const formData: Partial<LtftObjNew> = { id: "test-id", pmId: "pm-123" };
      await saveDraftForm(ltftJson, formData as LtftObjNew, false, false, true);

      expect(updateLtft).toHaveBeenCalledWith(
        expect.objectContaining({ showFailToastOnly: true })
      );
    });

    it("should not redirect when shouldRedirect is false", async () => {
      const formData: Partial<FormRPartA> = { id: "test-id" };
      await saveDraftForm(
        formAJson,
        formData as FormRPartA,
        false,
        false,
        false,
        false
      );

      expect(history.push).not.toHaveBeenCalled();
    });

    it("should not redirect when save status is not 'succeeded'", async () => {
      const formData: Partial<FormRPartA> = { id: "test-id" };

      (store.getState as jest.Mock).mockReturnValueOnce({
        formA: { saveStatus: "failed" },
        formB: { saveStatus: "succeeded" },
        ltft: { saveStatus: "succeeded" },
        traineeProfile: { traineeProfileData: { programmeMemberships: [] } }
      });

      await saveDraftForm(formAJson, formData as FormRPartA);

      expect(history.push).not.toHaveBeenCalled();
    });
  });

  describe("Form ID handling tests", () => {
    it("should get formA ID from store when not in formData", async () => {
      const formData: Partial<FormRPartA> = { traineeTisId: "trainee123" };

      await saveDraftForm(formAJson, formData as FormRPartA);

      expect(updateFormA).toHaveBeenCalledWith(
        expect.objectContaining({
          formData: expect.objectContaining({
            id: "new-formA-id"
          })
        })
      );
    });

    it("should get formB ID from store when not in formData", async () => {
      const formData: Partial<FormRPartB> = { traineeTisId: "trainee123" };

      await saveDraftForm(formBJson, formData as FormRPartB);

      expect(updateFormB).toHaveBeenCalledWith(
        expect.objectContaining({
          formData: expect.objectContaining({
            id: "new-formB-id"
          })
        })
      );
    });

    it("should get ltft ID from store when not in formData", async () => {
      const formData: Partial<LtftObjNew> = {
        traineeTisId: "trainee123",
        pmId: "pm-123"
      };

      await saveDraftForm(ltftJson, formData as LtftObjNew);

      expect(updateLtft).toHaveBeenCalledWith(
        expect.objectContaining({
          formData: expect.objectContaining({
            id: "new-ltft-id"
          })
        })
      );
    });

    it("should call saveForm when no ID is available", async () => {
      const formData: Partial<FormRPartA> = { traineeTisId: "trainee123" };

      (store.getState as jest.Mock).mockReturnValueOnce({
        formA: { saveStatus: "succeeded", newFormId: null },
        formB: { saveStatus: "succeeded" },
        ltft: { saveStatus: "succeeded" },
        traineeProfile: { traineeProfileData: { programmeMemberships: [] } }
      });

      await saveDraftForm(formAJson, formData as FormRPartA);

      expect(saveFormA).toHaveBeenCalled();
      expect(updateFormA).not.toHaveBeenCalled();
    });
  });
});
