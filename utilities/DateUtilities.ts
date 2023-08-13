import day from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { Placement } from "../models/Placement";

day.extend(isBetween);
day.extend(isSameOrBefore);
day.extend(isSameOrAfter);
const todayDate = day().toDate();
export type DateType = Date | string | null | undefined;
export type DateUnitType =
  | "millisecond"
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "month"
  | "year"
  | "date"
  | "milliseconds"
  | "seconds"
  | "minutes"
  | "hours"
  | "days"
  | "months"
  | "years"
  | "dates"
  | "d"
  | "w"
  | "Q"
  | "M"
  | "y"
  | "h"
  | "m"
  | "s"
  | "ms";
export class DateUtilities {
  public static ToUTCDate(date: DateType): string {
    let utcDate = "";

    if (date) {
      const dayDate = day(date);
      utcDate = dayDate.isValid() ? day(date).format("YYYY-MM-DD") : "";
    }

    return utcDate;
  }

  public static ToLocalDate(date: DateType): string {
    let localDate = "";
    if (date) {
      const dayDate = day(date);
      localDate = dayDate.isValid() ? dayDate.format("DD/MM/YYYY") : "";
    }
    return localDate;
  }

  public static ToLocalDateTime(date: DateType): string {
    let localDate = "";
    if (date) {
      const dayDate = day(date);
      localDate = dayDate.isValid() ? dayDate.format("DD/MM/YYYY HH:mm") : "";
    }

    return localDate;
  }

  public static IsLegalAge(value: DateType | undefined): boolean {
    if (value) {
      const dayDate = day(value);
      return dayDate.isValid() && day().diff(dayDate, "years") >= 18;
    }
    return true;
  }

  public static IsMoreThanMinDate(value: DateType | undefined): boolean {
    if (value) {
      const dayDate = day(value);
      return dayDate.isValid() && day().diff(dayDate, "years") < 100;
    }
    return true;
  }

  public static IsLessThanMaxDate(value: DateType | undefined): boolean {
    if (value) {
      const dayDate = day(value);
      const maxDate = day().add(50, "y");
      return dayDate.isValid() && dayDate < maxDate;
    }
    return true;
  }

  public static IsInsideDateRange(value: DateType | undefined): boolean {
    if (value) {
      const dayDate = day(value);
      const minDate = day().subtract(25, "y");
      const maxDate = day().add(25, "y");
      return dayDate.isValid() && dayDate.isBetween(minDate, maxDate);
    }
    return true;
  }

  public static IsPastDate(value: DateType | undefined): boolean {
    if (value) {
      const dayDate = day(value);
      return dayDate.isValid() && dayDate.isSameOrBefore(todayDate, "day");
    }
    return true;
  }

  public static IsFutureDate(value: DateType | undefined): boolean {
    if (value) {
      const dayDate = day(value);
      return dayDate.isValid() && dayDate.isSameOrAfter(todayDate, "day");
    }
    return true;
  }

  public static NowToGbDateTimeString() {
    const timeZoneOptions: any = {
      timeZone: "Europe/London",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    };
    const gbDate = new Date().toLocaleDateString("en-GB");
    const gbTime = new Date().toLocaleTimeString("en-GB", timeZoneOptions);
    return `${gbDate} ${gbTime}`;
  }

  private static gSorter<T>(
    a: T,
    b: T,
    objKey: Extract<keyof T, string | Date>,
    isDesc: boolean
  ) {
    const result = a[objKey] > b[objKey] ? 1 : -1;
    return isDesc ? result * -1 : result;
  }

  public static genericSort<T>(
    arr: T[],
    prop: Extract<keyof T, string | Date>,
    desc: boolean
  ) {
    return arr.sort((a, b) => DateUtilities.gSorter(a, b, prop, desc));
  }
}
export const isWithinRange = (
  date: DateType = null,
  range: number = 1,
  unit: DateUnitType = "d",
  dateToCompare: DateType = day().toDate()
): boolean => {
  return date ? day(dateToCompare).diff(date, unit) < range : false;
};

// Utils for Grouping Placements by Date

export const today = day(new Date()).format("YYYY-MM-DD");
export const yesterday = day(today).subtract(1, "day").format("YYYY-MM-DD");
export const oneWeekAgo = day(today).subtract(7, "day").format("YYYY-MM-DD");
export const twelveWeeksAhead = day(new Date())
  .add(12, "week")
  .format("YYYY-MM-DD");
export const twelveWeeksAheadPlusOneDay = day(twelveWeeksAhead)
  .add(1, "day")
  .format("YYYY-MM-DD");

export function isPastIt(date: DateType): boolean {
  return day(date).format("YYYY-MM-DD") < today;
}

export function isCurrentPl(pl: Placement): boolean {
  const { startDate, endDate } = pl;
  return (
    day(endDate).format("YYYY-MM-DD") >= today &&
    day(startDate).format("YYYY-MM-DD") <= today
  );
}

export function isUpcomingPl(pl: Placement): boolean {
  const { startDate } = pl;
  return (
    day(startDate).format("YYYY-MM-DD") > today &&
    day(startDate).format("YYYY-MM-DD") <= twelveWeeksAhead
  );
}

export function isFuturePl(pl: Placement): boolean {
  const { startDate } = pl;
  return day(startDate).format("YYYY-MM-DD") > twelveWeeksAhead;
}
