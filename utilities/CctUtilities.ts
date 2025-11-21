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
  const chunkDays = dayjs(currentProgEndDate).diff(startDate, "days");
  const chunkDaysWTE = Math.ceil((chunkDays * currentWte) / (wte as number));
  return dayjs(currentProgEndDate)
    .add(chunkDaysWTE - chunkDays, "days")
    .format("YYYY-MM-DD");
}

export function calcCctDate(
  currentProgEndDate: Date | string | undefined,
  currentWte: number | null,
  newWte: number | null,
  changeStartDate: Date | string | null
) {
  if (
    !currentProgEndDate ||
    currentWte === null ||
    newWte === null ||
    changeStartDate === null
  ) {
    return "";
  }

  const chunkDays = dayjs(currentProgEndDate).diff(changeStartDate, "days");
  const chunkDaysWTE = Math.ceil((chunkDays * currentWte) / newWte);
  return dayjs(currentProgEndDate)
    .add(chunkDaysWTE - chunkDays, "days")
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
