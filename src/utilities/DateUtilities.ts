import day from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

day.extend(isBetween);
day.extend(isSameOrBefore);
day.extend(isSameOrAfter);
const todayDate = day().toDate();
const dateToday = day();
export type DateType = Date | string | null;
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

  public static SortDateDecending<T>(arr: T[] = [], dateFieldName: string) {
    return [...arr].sort(
      (a: any, b: any) =>
        new Date(b[dateFieldName]).getTime() -
        new Date(a[dateFieldName]).getTime()
    );
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

  public static isInsideLimit(
    value: DateType | undefined,
    num: number = 1,
    unit: DateUnitType = "d"
  ) {
    if (value) {
      return dateToday.diff(value, unit) < num;
    }
  }
}
