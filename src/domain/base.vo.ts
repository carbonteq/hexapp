import { Result } from "@carbonteq/fp";
import { z } from "zod";
import { ValidationError } from "./base.errors.js";
import { DateTime } from "./refined.types.js";

export abstract class BaseValueObject<T> {
  abstract serialize(): T;

  /** Util method to use associated parser in boundary validators */
  //@ts-ignore
  getParser?();
}

export interface IDateRange {
  startDate: DateTime;
  endDate: DateTime;
}
const dateRangeParser = z.object({
  startDate: DateTime,
  endDate: DateTime,
});
// Can be Domain Error
export class InvalidDateRange extends ValidationError {}

export class DateRange extends BaseValueObject<IDateRange> {
  private constructor(
    readonly start: DateTime,
    readonly end: DateTime,
  ) {
    super();
  }

  private ensureValidRange(): Result<DateRange, InvalidDateRange> {
    if (this.intervalMs() < 0)
      return Result.Err(
        new InvalidDateRange(
          `Start Date <${this.start}> must be <= End Date <${this.end}>`,
        ),
      );

    return Result.Ok(this);
  }

  static create(data: unknown): Result<DateRange, InvalidDateRange> {
    const parseRes = dateRangeParser.safeParse(data);

    if (!parseRes.success)
      return Result.Err(new InvalidDateRange(`Invalid Date Range: <${data}>`));

    const range = new DateRange(parseRes.data.startDate, parseRes.data.endDate);

    return range.ensureValidRange();
  }

  static from(other: IDateRange) {
    return new DateRange(other.startDate, other.endDate);
  }

  intervalMs() {
    return this.end.getTime() - this.start.getTime();
  }

  serialize(): IDateRange {
    return { startDate: this.start, endDate: this.end };
  }

  getParser() {
    return dateRangeParser;
  }
}
