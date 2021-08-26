import day from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';

day.extend(isBetween);

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
    return false;
  }

  public static IsMoreThanMinDate(
    value: Date | string | null | undefined
  ): boolean {
    if (value) {
      const dayDate = day(value);
      return dayDate.isValid() && day().diff(dayDate, "years") < 100;
    }
    return false;
  }

  public static IsLessThanMaxDate(
    value: Date | string | null | undefined
  ): boolean {
    if (value) {
      const dayDate = day(value);
      const maxDate = day().add(50, "y");
      return dayDate.isValid() && dayDate < maxDate;
    }
    return false;
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
    return false;
  }

  public static IsPastDate(value: Date | string | null | undefined): boolean {
    if (value) {
      const dayDate = day(value);
      return dayDate.isValid() && day().diff(dayDate, "days") >= 1;
    }
    return false;
  }

  public static IsFutureDate(value: Date | string | null | undefined): boolean {
    if (value) {
      const dayDate = day(value);
      return dayDate.isValid() && day().diff(dayDate, "years") <= 1;
    }
    return false;
  }
}
