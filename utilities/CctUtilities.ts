import dayjs from "dayjs";
import { ProgrammeMembership } from "../models/ProgrammeMembership";
import {
  CalculationType,
  CctCalculation,
  CctChangeType,
  saveCctCalc,
  updateCctCalc,
  updatedFormSaveStatus
} from "../redux/slices/cctSlice";
import store from "../redux/store/store";
import history from "../components/navigation/history";
import calculationRulesJson from "./cctCalculationRules.json";

export type CalculationTypeConfig = {
  label: string;
  shortLabel: string;
  category: string;
  hasWteChangeField: boolean;
};

export type CalculationRules = {
  types: Record<string, CalculationTypeConfig>;
};

export const calculationRules: CalculationRules =
  calculationRulesJson as CalculationRules;

export function getCalculationTypeConfig(
  type: CalculationType
): CalculationTypeConfig {
  return calculationRules.types[type];
}

export function getCalculationTypeOptions(): {
  value: string;
  label: string;
}[] {
  return Object.entries(calculationRules.types).map(([key, config]) => ({
    value: key,
    label: config.shortLabel
  }));
}

export function hasWteChangeField(type: CalculationType): boolean {
  return calculationRules.types[type]?.hasWteChangeField ?? false;
}

export function findLinkedProgramme(
  id: string | null,
  progs: ProgrammeMembership[]
) {
  return progs.find(prog => prog.tisId === id);
}

export function makeProgrammeOptions(progs: ProgrammeMembership[]) {
  return progs.map(programme => ({
    label: `${programme.programmeName} (${dayjs(programme.startDate).format(
      "DD/MM/YYYY"
    )} to ${dayjs(programme.endDate).format("DD/MM/YYYY")})`,
    value: programme.tisId
  }));
}

export function setDefaultProgrammeOption(
  id: string | null,
  progs: ProgrammeMembership[]
) {
  const selectedProgramme = id ? findLinkedProgramme(id, progs) : null;
  return selectedProgramme
    ? {
        label: `${selectedProgramme.programmeName} (${dayjs(
          selectedProgramme.startDate
        ).format("DD/MM/YYYY")} to ${dayjs(selectedProgramme.endDate).format(
          "DD/MM/YYYY"
        )})`,
        value: selectedProgramme.tisId
      }
    : null;
}

export function calcCctExtension(
  changeStartDate: Date | string,
  changeEndDate: Date | string,
  newWte: number = 0
): number {
  const changeDays = dayjs(changeEndDate).diff(changeStartDate, "days") + 1;
  const wteDays = changeDays * newWte;
  return Math.round(changeDays - wteDays);
}

// Note: calcCctDate currently used in formBuilderUtilities for a single cct calc so kept it as a standlone calc for now
export function calcCctDate(
  currentProgEndDate: Date | string,
  changeStartDate: Date | string,
  changeEndDate: Date | string,
  newWte: number = 0
) {
  const cctExtension = calcCctExtension(changeStartDate, changeEndDate, newWte);
  return dayjs(currentProgEndDate)
    .add(cctExtension, "days")
    .format("YYYY-MM-DD");
}

// Note: Used in CctCalcCreate for the multi-change/ multi-change-type calculations
export function calculateAllChanges(
  changes: CctChangeType[],
  programmeEndDate: string
): CctChangeType[] {
  const sortedChanges = [...changes].sort((a, b) =>
    dayjs(a.startDate).diff(dayjs(b.startDate))
  );
  let cumulativeExtension = 0;
  return sortedChanges.map(change => {
    const wte = change?.wte ?? 0;
    const daysAdded = calcCctExtension(change.startDate, change.endDate, wte);
    cumulativeExtension += daysAdded;
    const resultingCctDate = dayjs(programmeEndDate)
      .add(cumulativeExtension, "days")
      .format("YYYY-MM-DD");
    return { ...change, daysAdded, resultingCctDate };
  });
}

export function hydrateCctCalc(cctCalc: CctCalculation): CctCalculation {
  const pmEndDate = cctCalc.programmeMembership.endDate as string;
  const hydratedChanges = calculateAllChanges(cctCalc.changes, pmEndDate);
  return { ...cctCalc, changes: hydratedChanges };
}

export async function handleCctSubmit(
  startSubmitting: () => void,
  stopSubmitting: () => void,
  calcData: CctCalculation,
  name?: string
) {
  startSubmitting();
  store.dispatch(updatedFormSaveStatus("idle"));
  const payload: CctCalculation = {
    ...calcData,
    changes: calcData.changes.map(
      ({ daysAdded, resultingCctDate, ...rest }) => rest
    )
  };
  if (calcData.id) {
    await store.dispatch(updateCctCalc(payload));
  } else {
    const trimmedName = name?.trim();
    await store.dispatch(saveCctCalc({ ...payload, name: trimmedName }));
  }
  const formSaveStatus = store.getState().cct.formSaveStatus;
  if (formSaveStatus === "succeeded") {
    history.push("/cct");
  }
  stopSubmitting();
}
