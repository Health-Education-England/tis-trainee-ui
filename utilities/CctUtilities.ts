import dayjs from "dayjs";
import store from "../redux/store/store";
import { resetCctCalc } from "../redux/slices/cctCalcSlice";
import { ProgrammeMembership } from "../models/ProgrammeMembership";

export type FtePercentsTypes = {
  value: number | string;
  label: string;
};

export type NewEndDatesTypes = {
  ftePercent: string;
  newEndDate: string;
};

export function calculateNewEndDates(
  currentFtePercent: number,
  ftePercents: FtePercentsTypes[],
  propStartDate: Date | string,
  propEndDate: Date | string,
  currentProgEndDate: Date | string
): NewEndDatesTypes[] {
  const chunkDays = dayjs(propEndDate).diff(propStartDate, "days");
  return ftePercents.map(ftePercent => {
    if (typeof ftePercent.value === "string") {
      ftePercent.value = Number(ftePercent.value.split("%")[0]);
    }
    if (!ftePercent.label.includes("%")) {
      ftePercent.label = `${ftePercent.label}%`;
    }
    const chunkDaysWTE = Math.ceil(
      (chunkDays * currentFtePercent) / ftePercent.value
    );
    const newEndDate = dayjs(currentProgEndDate).add(
      chunkDaysWTE - chunkDays,
      "days"
    );
    return {
      ftePercent: ftePercent.label,
      newEndDate: newEndDate.format("DD/MM/YYYY")
    };
  });
}

export function handleClose() {
  store.dispatch(resetCctCalc());
}

export function calcDefaultPropStartDate(
  programmeStartDate: string,
  programmeEndDate: string
): string {
  const sixteenWeeksFromNow = dayjs().add(16, "weeks").format("YYYY-MM-DD");

  if (dayjs(programmeStartDate).isSameOrAfter(sixteenWeeksFromNow)) {
    return programmeStartDate;
  }

  if (dayjs(programmeEndDate).isBefore(sixteenWeeksFromNow)) {
    return "";
  }

  return sixteenWeeksFromNow;
}

export function findLinkedProgramme(
  id: string | null,
  progs: ProgrammeMembership[]
) {
  return progs.find(prog => prog.tisId === id);
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

export function makeProgrammeOptions(progs: ProgrammeMembership[]) {
  return progs.map(programme => ({
    label: `${programme.programmeName} (${dayjs(programme.startDate).format(
      "DD/MM/YYYY"
    )})`,
    value: programme.tisId
  }));
}

export const standardWtePercents: FtePercentsTypes[] = [
  { label: "100%", value: 100 },
  { label: "80%", value: 80 },
  { label: "70%", value: 70 },
  { label: "60%", value: 60 },
  { label: "50%", value: 50 }
];
