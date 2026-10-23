/*
 * TEMP STUB - NOT THE REAL CCT ENGINE.
 *
 * The real engine will be a Java rewrite of ~/cct-calculator-app src/core/calculations.ts in tis-trainee-details,
 * reached via POST /api/cct/calculate.
 * This just helps get the FE up and running a bit quicker.
 * Delete it once the endpoint is live.
 *
 * Note: every wte % is a fraction (0.01-1), not the POC's 0-100%.
 * Note: the programme end dates are floored, like the CCT date and the Excel calculator, not rounded as in the POC.
 */
import day from "dayjs";
import {
  CctChangeDto,
  CctPeriod,
  CctProgrammeDetails,
  CctResult
} from "../models/CctTypes";
import {
  deriveCctAssumedPeriods,
  deriveCctProjection,
  isOpenLtftChange
} from "../utilities/CctUtilities";

const DAYS_PER_MONTH = 30.4;
const COMPLETED_PERIOD_DAYS_PER_MONTH = 365 / 12;
const FLOOR_TOLERANCE_DAYS = 1e-9;

const inclusiveDays = (start: string, end: string) =>
  day(end).diff(day(start), "day") + 1;

const completedMonths = (start: string, end: string) =>
  inclusiveDays(start, end) / COMPLETED_PERIOD_DAYS_PER_MONTH;

export const wteFractionFor = (change: CctChangeDto) => {
  if (!change.countsTowardsCompletion) return 0;
  if (change.type === "OOPT") return 1;
  return change.wte ?? 0;
};

export const calendarMonthsFor = (change: CctChangeDto) =>
  change.endDate ? completedMonths(change.startDate, change.endDate) : 0;

export const wteMonthsFor = (change: CctChangeDto) =>
  calendarMonthsFor(change) * wteFractionFor(change);

const adjustedLengthMonths = (programmeDetails: CctProgrammeDetails) =>
  programmeDetails.lengthMonths +
  programmeDetails.additionalMonths -
  programmeDetails.acceleratedMonths;

const dateAfterMonths = (startDate: string, months: number) =>
  day(startDate)
    .add(Math.floor(months * DAYS_PER_MONTH + FLOOR_TOLERANCE_DAYS), "day")
    .format("YYYY-MM-DD");

const roundToTwoDecimals = (months: number) => Math.round(months * 100) / 100;

const findCompletionDate = (lengthMonths: number, periods: CctPeriod[]) => {
  let monthsCompleted = 0;
  for (const { startDate, endDate, wteMonths } of [...periods].sort((a, b) =>
    a.startDate.localeCompare(b.startDate)
  )) {
    if (!endDate || !wteMonths) continue;
    const days = inclusiveDays(startDate, endDate);
    for (let daysIn = 1; daysIn <= days; daysIn++)
      if (
        roundToTwoDecimals(
          lengthMonths - monthsCompleted - (wteMonths * daysIn) / days
        ) <= 0
      )
        return day(startDate)
          .add(daysIn - 1, "day")
          .format("YYYY-MM-DD");
    monthsCompleted += wteMonths;
  }
  return null;
};

export function calculateCctResult(
  programmeDetails: CctProgrammeDetails,
  changes: CctChangeDto[]
): CctResult {
  const projection = deriveCctProjection(programmeDetails, changes);
  const datedChanges = changes.filter(change => !isOpenLtftChange(change));

  const calendarMonthsBeforeProjection =
    day(projection.startDate).diff(day(programmeDetails.startDate), "day") /
    COMPLETED_PERIOD_DAYS_PER_MONTH;
  const changesCalendarMonths = datedChanges.reduce(
    (sum, change) => sum + calendarMonthsFor(change),
    0
  );
  const gapCalendarMonths = Math.max(
    0,
    calendarMonthsBeforeProjection - changesCalendarMonths
  );
  const totalWteMonthsCompleted =
    datedChanges.reduce((sum, change) => sum + wteMonthsFor(change), 0) +
    gapCalendarMonths;
  const monthsRemaining = roundToTwoDecimals(
    adjustedLengthMonths(programmeDetails) - totalWteMonthsCompleted
  );

  const calendarMonthsToCompletion = monthsRemaining / projection.wte;

  const changePeriods: CctPeriod[] = changes.map(change => {
    const isOpen = isOpenLtftChange(change);
    return {
      kind: "CHANGE",
      startDate: change.startDate,
      endDate: isOpen ? null : change.endDate,
      calendarMonths: isOpen ? null : calendarMonthsFor(change),
      wteMonths: isOpen ? null : wteMonthsFor(change)
    };
  });

  const assumedPeriods: CctPeriod[] = deriveCctAssumedPeriods(
    programmeDetails,
    changes,
    projection.startDate
  ).map(period => ({
    kind: "ASSUMED_FULL_TIME",
    startDate: period.startDate,
    endDate: period.endDate,
    calendarMonths: completedMonths(period.startDate, period.endDate),
    wteMonths: completedMonths(period.startDate, period.endDate)
  }));

  const cctDate =
    findCompletionDate(adjustedLengthMonths(programmeDetails), [
      ...changePeriods,
      ...assumedPeriods
    ]) ?? dateAfterMonths(projection.startDate, calendarMonthsToCompletion);

  const projectionPeriod: CctPeriod = {
    kind: "PROJECTION",
    startDate: projection.startDate,
    endDate: cctDate,
    calendarMonths: calendarMonthsToCompletion,
    wteMonths: monthsRemaining
  };

  return {
    cctDate,
    originalProgrammeEndDate: dateAfterMonths(
      programmeDetails.startDate,
      programmeDetails.lengthMonths
    ),
    adjustedProgrammeEndDate: dateAfterMonths(
      programmeDetails.startDate,
      adjustedLengthMonths(programmeDetails)
    ),
    totalWteMonthsCompleted,
    monthsRemaining,
    periods: [...changePeriods, ...assumedPeriods, projectionPeriod]
  };
}
