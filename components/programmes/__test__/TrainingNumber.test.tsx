import React from "react";
import { render, screen, queryByAttribute } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TrainingNumber } from "../TrainingNumber";
import { calcTrainingNumStatus } from "../../../utilities/OnboardingTrackerUtilities";
import { useTraineeActions } from "../../../utilities/hooks/useTraineeActions";

jest.mock("../../../utilities/hooks/useTraineeActions", () => ({
  useTraineeActions: jest.fn()
}));

jest.mock("../../../utilities/OnboardingTrackerUtilities", () => ({
  calcTrainingNumStatus: jest.fn()
}));

describe("TrainingNumber", () => {
  const mockUseTraineeActions = useTraineeActions as jest.Mock;
  const mockCalcTrainingNumStatus = calcTrainingNumStatus as jest.Mock;

  beforeEach(() => {
    mockUseTraineeActions.mockReturnValue({
      filteredActionsBelongingToThisProg: []
    });

    mockCalcTrainingNumStatus.mockReturnValue({
      details: {
        SIGN_COJ: "completed",
        SIGN_FORM_R_PART_A: "completed",
        SIGN_FORM_R_PART_B: "completed"
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = (ui: React.ReactElement) => {
    const utils = render(<MemoryRouter>{ui}</MemoryRouter>);

    const getByDataCy = (value: string) =>
      queryByAttribute("data-cy", utils.container, value);

    return {
      ...utils,
      getByDataCy
    };
  };

  test("displays 'Not Available' when training number is null", () => {
    const props = {
      trainingNumber: null,
      gmcNumber: "1234567",
      gdcNumber: null,
      panelId: "panel-1"
    };

    const { getByDataCy } = renderWithRouter(<TrainingNumber {...props} />);

    expect(getByDataCy("trainingNumberNa")).toBeInTheDocument();
    expect(getByDataCy("trainingNumberNa")).toHaveTextContent("Not Available");
  });

  test("displays training number when all requirements are met with valid GMC", () => {
    const props = {
      trainingNumber: "TRN12345",
      gmcNumber: "1234567",
      gdcNumber: null,
      panelId: "panel-1"
    };

    const { getByDataCy } = renderWithRouter(<TrainingNumber {...props} />);

    expect(getByDataCy("trainingNumberText")).toBeInTheDocument();
    expect(getByDataCy("trainingNumberText")).toHaveTextContent("TRN12345");
  });

  test("displays training number when all requirements are met with valid GDC", () => {
    const props = {
      trainingNumber: "TRN12345",
      gmcNumber: null,
      gdcNumber: "12345",
      panelId: "panel-1"
    };

    const { getByDataCy } = renderWithRouter(<TrainingNumber {...props} />);

    expect(getByDataCy("trainingNumberText")).toBeInTheDocument();
    expect(getByDataCy("trainingNumberText")).toHaveTextContent("TRN12345");
  });

  test("shows requirement list when all conditions aren't met", () => {
    // Set all requirements as outstanding
    mockCalcTrainingNumStatus.mockReturnValue({
      details: {
        SIGN_COJ: "outstanding",
        SIGN_FORM_R_PART_A: "outstanding",
        SIGN_FORM_R_PART_B: "outstanding"
      }
    });

    const props = {
      trainingNumber: "TRN12345",
      gmcNumber: "1234567",
      gdcNumber: null,
      panelId: "panel-1"
    };

    const { getByDataCy } = renderWithRouter(<TrainingNumber {...props} />);

    expect(screen.getByText("Available after submitting:")).toBeInTheDocument();
    expect(getByDataCy("requireCoj")).toBeInTheDocument();
    expect(getByDataCy("requireFormRA")).toBeInTheDocument();
    expect(getByDataCy("requireFormRB")).toBeInTheDocument();
  });

  test("shows only COJ requirement when only COJ is outstanding", () => {
    mockCalcTrainingNumStatus.mockReturnValue({
      details: {
        SIGN_COJ: "outstanding",
        SIGN_FORM_R_PART_A: "completed",
        SIGN_FORM_R_PART_B: "completed"
      }
    });

    const props = {
      trainingNumber: "TRN12345",
      gmcNumber: "1234567",
      gdcNumber: null,
      panelId: "panel-1"
    };

    const { getByDataCy } = renderWithRouter(<TrainingNumber {...props} />);

    expect(screen.getByText("Available after submitting:")).toBeInTheDocument();
    expect(getByDataCy("requireCoj")).toBeInTheDocument();
    expect(screen.queryByTestId("requireFormRA")).not.toBeInTheDocument();
    expect(screen.queryByTestId("requireFormRB")).not.toBeInTheDocument();
  });

  test("shows only Form R Part A requirement when only Form R Part A is outstanding", () => {
    mockCalcTrainingNumStatus.mockReturnValue({
      details: {
        SIGN_COJ: "completed",
        SIGN_FORM_R_PART_A: "outstanding",
        SIGN_FORM_R_PART_B: "completed"
      }
    });

    const props = {
      trainingNumber: "TRN12345",
      gmcNumber: "1234567", // valid
      gdcNumber: null,
      panelId: "panel-1"
    };

    const { getByDataCy } = renderWithRouter(<TrainingNumber {...props} />);

    expect(screen.getByText("Available after submitting:")).toBeInTheDocument();
    expect(screen.queryByTestId("requireCoj")).not.toBeInTheDocument();
    expect(getByDataCy("requireFormRA")).toBeInTheDocument();
    expect(screen.queryByTestId("requireFormRB")).not.toBeInTheDocument();
  });

  test("shows only Form R Part B requirement when only Form R Part B is outstanding", () => {
    mockCalcTrainingNumStatus.mockReturnValue({
      details: {
        SIGN_COJ: "completed",
        SIGN_FORM_R_PART_A: "completed",
        SIGN_FORM_R_PART_B: "outstanding"
      }
    });

    const props = {
      trainingNumber: "TRN12345",
      gmcNumber: "1234567",
      gdcNumber: null,
      panelId: "panel-1"
    };

    const { getByDataCy } = renderWithRouter(<TrainingNumber {...props} />);

    expect(screen.getByText("Available after submitting:")).toBeInTheDocument();
    expect(screen.queryByTestId("requireCoj")).not.toBeInTheDocument();
    expect(screen.queryByTestId("requireFormRA")).not.toBeInTheDocument();
    expect(getByDataCy("requireFormRB")).toBeInTheDocument();
  });

  test("shows GMC/GDC requirement when numbers are invalid", () => {
    const props = {
      trainingNumber: "TRN12345",
      gmcNumber: "12345",
      gdcNumber: "123",
      panelId: "panel-1"
    };

    const { getByDataCy } = renderWithRouter(<TrainingNumber {...props} />);

    expect(screen.getByText("Available after submitting:")).toBeInTheDocument();
    expect(getByDataCy("requireGmcOrGdc")).toBeInTheDocument();
    expect(screen.getByText("Go to Profile to update")).toBeInTheDocument();
  });

  test("verifies the link to profile for GMC/GDC validation", () => {
    const props = {
      trainingNumber: "TRN12345",
      gmcNumber: "12345", // invalid
      gdcNumber: null,
      panelId: "panel-1"
    };

    renderWithRouter(<TrainingNumber {...props} />);

    const link = screen.getByText("Go to Profile to update");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "/profile");
  });

  test("uses the panelId to fetch filtered actions", () => {
    const props = {
      trainingNumber: "TRN12345",
      gmcNumber: "1234567",
      gdcNumber: null,
      panelId: "test-panel-id"
    };

    renderWithRouter(<TrainingNumber {...props} />);

    expect(mockUseTraineeActions).toHaveBeenCalledWith("test-panel-id");
  });

  test("passes the filtered actions to calcTrainingNumStatus", () => {
    const mockFilteredActions = [{ id: "123", type: "SIGN_COJ" }];
    mockUseTraineeActions.mockReturnValue({
      filteredActionsBelongingToThisProg: mockFilteredActions
    });

    const props = {
      trainingNumber: "TRN12345",
      gmcNumber: "1234567",
      gdcNumber: null,
      panelId: "panel-1"
    };

    renderWithRouter(<TrainingNumber {...props} />);

    expect(mockCalcTrainingNumStatus).toHaveBeenCalledWith(mockFilteredActions);
  });
});
