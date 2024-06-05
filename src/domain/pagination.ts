import { Result } from "@carbonteq/fp";
import { z } from "zod";
import { ValidationError } from "./base.errors";

export class PaginationOptionsValidationError extends ValidationError {
	constructor(issues: string) {
		super(`Invalid pagination options: ${issues}`);
	}
}

const DEFAULT_PAGINATION_OPTS = {
	pageNum: 1,
	pageSize: 100,
} as const;

const DISCRIMINANT = Symbol("PaginationOptions");

export class PaginationOptions {
	private static readonly schema = z.object({
		pageNum: z.coerce
			.number()
			.positive()
			.default(DEFAULT_PAGINATION_OPTS.pageNum),
		pageSize: z.coerce
			.number()
			.positive()
			.default(DEFAULT_PAGINATION_OPTS.pageSize),
	});
	private readonly _DISCRIMINATOR = DISCRIMINANT;

	private constructor(
		readonly pageNum: number,
		readonly pageSize: number,
	) {}

	/**
	 * Validate the passed options to create `PaginationOptions` instance
	 * @param options - Pagination Options
	 * @param {number} options.pageNum - Page Number (default = 1)
	 * @param {number} options.pageSize - Page Size (default = 100)
	 * @returns {PaginationOptions} PaginationOptions instance
	 */
	static create(
		options: unknown,
	): Result<PaginationOptions, PaginationOptionsValidationError> {
		const r = PaginationOptions.schema.safeParse(options);

		if (r.success) {
			return Result.Ok(new PaginationOptions(r.data.pageNum, r.data.pageSize));
		}

		const err = JSON.stringify(r.error.flatten());
		return Result.Err(new PaginationOptionsValidationError(err));
	}
}

export interface Paginated<T> {
	data: T[];
	readonly pageNum: number;
	readonly pageSize: number;
	readonly totalPages: number;
}

export class Paginator {
	static readonly DEFAULT_PAGINATION_OPTS = DEFAULT_PAGINATION_OPTS;

	private constructor(
		readonly paginationOpts: PaginationOptions = DEFAULT_PAGINATION_OPTS as PaginationOptions,
	) {}

	fromAll<T>(coll: T[]): Paginated<T> {
		return Paginator.fromAll(coll, this.paginationOpts);
	}

	fromSubset<T>(coll: T[], totalElements: number): Paginated<T> {
		return Paginator.fromSubset(coll, this.paginationOpts, totalElements);
	}

	static fromAll<T>(
		coll: T[],
		{ pageNum, pageSize }: PaginationOptions,
	): Paginated<T> {
		const totalPages = Math.ceil(coll.length / pageSize) || 1;
		const startIdx = (pageNum - 1) * pageSize;
		const collSlice = coll.slice(startIdx, startIdx + pageSize);

		return { data: collSlice, pageNum, pageSize, totalPages };
	}

	/**
	 * For cases where the input data has already been sliced according to the pagination options, e.g. using a DB query
	 */
	static fromSubset<T>(
		coll: T[],
		{ pageSize, pageNum }: PaginationOptions,
		totalElements: number,
	): Paginated<T> {
		const totalPages = Math.ceil(totalElements / pageSize) || 1; // For empty input
		const collSlice = coll.slice(0, pageSize); // Ensure the size of data <= pageSize, which is a guarantee Paginated<T> provides

		return { data: collSlice, pageNum, pageSize, totalPages };
	}
}
