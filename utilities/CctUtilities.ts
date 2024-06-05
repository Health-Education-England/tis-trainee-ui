import dayjs from "dayjs";
import store from "../redux/store/store";
import { closeCctModal } from "../redux/slices/cctCalcSlice";

export type FtePercentsTypes = {
  value: number | string;
  label: string;
};

export function calculateNewEndDates(
  currentFtePercent: number,
  ftePercents: FtePercentsTypes[],
  propStartDate: Date | string,
  propEndDate: Date | string,
  currentProgEndDate: Date | string
) {
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
  store.dispatch(closeCctModal());
}
