import { Result } from "@carbonteq/fp";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { ValidationError } from "./base.errors";

export class PaginationOptionsValidationError extends ValidationError {
	constructor(issues: string) {
		super(`Invalid pagination options: ${issues}`);
	}
}

const DEFAULT_PAGINATION_OPTS = {
	pageNum: 1,
	pageSize: 10,
} as const;

const DISCRIMINANT = Symbol("PaginationOptions");

export class PaginationOptions {
	static readonly DEFAULT_PAGE_NUM = DEFAULT_PAGINATION_OPTS.pageNum;
	static readonly DEFAULT_PAGE_SIZE = DEFAULT_PAGINATION_OPTS.pageSize;

	/** Offset (Assumes page 0 is your first page) */
	readonly offset: number;

	/** Offset (Assumes page 1 is your first page) */
	// readonly offset1: number;

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
	) {
		this.offset = pageSize * (pageNum - 1);
	}

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

		const err = fromZodError(r.error);
		return Result.Err(new PaginationOptionsValidationError(err.message));
	}
}

export interface Paginated<T> {
	data: T[];
	readonly pageNum: number;
	readonly pageSize: number;
	readonly totalPages: number;
}

export const Paginator: {
	paginate: <T>(coll: T[], opts: PaginationOptions) => Paginated<T>;
	// paginate1: <T>(coll: T[], opts: PaginationOptions) => Paginated<T>;
} = {
	paginate<T>(
		coll: T[],
		{ pageNum, pageSize, offset: offset0 }: PaginationOptions,
	): Paginated<T> {
		const totalPages = Math.ceil(coll.length / pageSize) || 1;
		const collSlice = coll.slice(offset0, offset0 + pageSize);

		return { data: collSlice, pageNum, pageSize, totalPages };
	},
	// paginate1<T>(
	// 	coll: T[],
	// 	{ pageNum, pageSize, offset1 }: PaginationOptions,
	// ): Paginated<T> {
	// 	const totalPages = Math.ceil(coll.length / pageSize) || 1;
	// 	const collSlice = coll.slice(offset1, offset1 + pageSize);
	//
	// 	return { data: collSlice, pageNum, pageSize, totalPages };
	// },
} as const;
