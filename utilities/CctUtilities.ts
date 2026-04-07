import dayjs from "dayjs";
import { ProgrammeMembership } from "../models/ProgrammeMembership";
import {
  CctCalculation,
  CctChangeType,
  saveCctCalc,
  updateCctCalc,
  updatedFormSaveStatus
} from "../redux/slices/cctSlice";
import store from "../redux/store/store";
import history from "../components/navigation/history";

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
        ).format("DD/MM/YYYY")})`,
        value: selectedProgramme.tisId
      }
    : null;
}

export function calcLtftChange(
  currentProgEndDate: Date | string,
  currentWte: number,
  change: CctChangeType
) {
  const { startDate, wte } = change;
  const fullTimeDays = dayjs(currentProgEndDate).diff(startDate, "days") + 1;
  const wteDays = fullTimeDays * ((wte as number) / currentWte);
  const ltftExtension = Math.round(fullTimeDays - wteDays);
  return dayjs(currentProgEndDate)
    .add(ltftExtension, "days")
    .format("YYYY-MM-DD");
}

export function calcCctDate(
  currentProgEndDate: Date | string,
  currentWte: number,
  newWte: number,
  changeStartDate: Date | string
) {
  const fullTimeDays =
    dayjs(currentProgEndDate).diff(changeStartDate, "days") + 1;
  const wteDays = fullTimeDays * (newWte / currentWte);
  const cctExtension = Math.round(fullTimeDays - wteDays);

  return dayjs(currentProgEndDate)
    .add(cctExtension, "days")
    .format("YYYY-MM-DD");
}

export async function handleCctSubmit(
  startSubmitting: () => void,
  stopSubmitting: () => void,
  calcData: CctCalculation,
  name?: string
) {
  startSubmitting();
  store.dispatch(updatedFormSaveStatus("idle"));
  if (calcData.id) {
    await store.dispatch(updateCctCalc(calcData));
  } else {
    const trimmedName = name?.trim();
    await store.dispatch(saveCctCalc({ ...calcData, name: trimmedName }));
  }
  const formSaveStatus = store.getState().cct.formSaveStatus;
  if (formSaveStatus === "succeeded") {
    history.push("/cct");
  }
  stopSubmitting();
}
