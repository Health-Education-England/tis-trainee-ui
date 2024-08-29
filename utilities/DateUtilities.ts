import day from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { Placement } from "../models/Placement";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { ProgrammeMembership } from "../models/ProgrammeMembership";
import { IDateBoxed } from "../models/IDateBoxed";

day.extend(utc);
day.extend(timezone);
day.extend(isBetween);
day.extend(isSameOrBefore);
day.extend(isSameOrAfter);
export const todayDate = day().toDate();
export const dateWithinYear = day().subtract(1, "year").add(1, "day").toDate();
export const dateExactlyYearAgo = day().subtract(1, "year").toDate();
export const dateMoreThanYearAgo = day()
  .subtract(1, "year")
  .subtract(1, "day")
  .toDate();
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

  private static isAmbiguousOctoberDate(date: day.Dayjs): boolean {
    const octoberDate = day(date).month(9).date(31);
    const lastSundayInOctober = octoberDate.day(0);
    return date.isBetween(
      lastSundayInOctober.hour(1).minute(0),
      lastSundayInOctober.hour(2).minute(0)
    );
  }

  public static ConvertToLondonTime(
    givenDate: DateType,
    includeSecs?: boolean
  ): string {
    if (!givenDate) return "No date provided";
    const utcDate = day.utc(givenDate);
    if (!utcDate.isValid()) return "Invalid date provided";
    const isOctAmbiguous = this.isAmbiguousOctoberDate(utcDate);
    if (isOctAmbiguous) {
      return `${utcDate.format(
        includeSecs ? "DD/MM/YYYY HH:mm:ss" : "DD/MM/YYYY HH:mm"
      )} (GMT)`;
    } else {
      const londonDate = utcDate.tz("Europe/London");
      const offset = londonDate.utcOffset();
      const daylightSavingStr = offset === 0 ? "GMT" : "BST";
      const formattedLondonDate = londonDate.format(
        includeSecs ? "DD/MM/YYYY HH:mm:ss" : "DD/MM/YYYY HH:mm"
      );
      return `${formattedLondonDate} (${daylightSavingStr})`;
    }
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

export function isCurrentDateBoxed(dateBoxed: IDateBoxed): boolean {
  const { startDate, endDate } = dateBoxed;
  return (
    day(endDate).format("YYYY-MM-DD") >= today &&
    day(startDate).format("YYYY-MM-DD") <= today
  );
}

export function isUpcomingDateBoxed(dateBoxed: IDateBoxed): boolean {
  const { startDate } = dateBoxed;
  return (
    day(startDate).format("YYYY-MM-DD") > today &&
    day(startDate).format("YYYY-MM-DD") <= twelveWeeksAhead
  );
}

export function isFutureDateBoxed(
  dateBoxed: IDateBoxed
): boolean {
  const { startDate } = dateBoxed;
  return day(startDate).format("YYYY-MM-DD") > twelveWeeksAhead;
}
