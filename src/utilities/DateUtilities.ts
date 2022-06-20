import day from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

day.extend(isBetween);
day.extend(isSameOrBefore);
day.extend(isSameOrAfter);
const todayDate = day().toDate();
export class DateUtilities {
  public static ToUTCDate(date: Date | string | null): string {
    let utcDate = "";

    if (date) {
      const dayDate = day(date);
      utcDate = dayDate.isValid() ? day(date).format("YYYY-MM-DD") : "";
    }

    return utcDate;
  }

  public static ToLocalDate(date: Date | string | null): string {
    let localDate = "";
    if (date) {
      const dayDate = day(date);
      localDate = dayDate.isValid() ? dayDate.format("DD/MM/YYYY") : "";
    }

    return localDate;
  }

  public static IsLegalAge(value: Date | string | null | undefined): boolean {
    if (value) {
      const dayDate = day(value);
      return dayDate.isValid() && day().diff(dayDate, "years") >= 18;
    }
    return true;
  }

  public static IsMoreThanMinDate(
    value: Date | string | null | undefined
  ): boolean {
    if (value) {
      const dayDate = day(value);
      return dayDate.isValid() && day().diff(dayDate, "years") < 100;
    }
    return true;
  }

  public static IsLessThanMaxDate(
    value: Date | string | null | undefined
  ): boolean {
    if (value) {
      const dayDate = day(value);
      const maxDate = day().add(50, "y");
      return dayDate.isValid() && dayDate < maxDate;
    }
    return true;
  }

  public static IsInsideDateRange(
    value: Date | string | null | undefined
  ): boolean {
    if (value) {
      const dayDate = day(value);
      const minDate = day().subtract(25, "y");
      const maxDate = day().add(25, "y");
      return dayDate.isValid() && dayDate.isBetween(minDate, maxDate);
    }
    return true;
  }

  public static IsPastDate(value: Date | string | null | undefined): boolean {
    if (value) {
      const dayDate = day(value);
      return dayDate.isValid() && dayDate.isSameOrBefore(todayDate, "day");
    }
    return true;
  }

  public static IsFutureDate(value: Date | string | null | undefined): boolean {
    if (value) {
      const dayDate = day(value);
      return dayDate.isValid() && dayDate.isSameOrAfter(todayDate, "day");
    }
    return true;
  }
}
