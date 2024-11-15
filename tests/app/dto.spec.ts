import * as assert from "node:assert";
import { describe, it } from "node:test";
import type { Result } from "@carbonteq/fp";
import {
	BaseDto,
	DtoValidationError,
} from "@carbonteq/hexapp/app/dto/index.js";
import { z } from "zod";

const COLOR_LEN = 7;
const FONT_MIN_LEN = 3;

// const objects are a better alternative to enums, atleast for now
const LABEL_TYPE = {
	DEFAULT: "default",
	ROUNDED: "rounded",
	RECTANGLE: "rectangle",
} as const;

type Label = keyof typeof LABEL_TYPE;
type LabelVal = (typeof LABEL_TYPE)[Label];

interface NewThemeData {
	primaryColor: string;
	secondaryColor: string;
	primaryFont: string;
	secondaryFont: string;
	label: LabelVal;
}

class NewThemeDto extends BaseDto {
	private static readonly schema = z.object({
		primaryColor: z.string().length(COLOR_LEN),
		secondaryColor: z.string().length(COLOR_LEN),
		primaryFont: z.string().min(FONT_MIN_LEN),
		secondaryFont: z.string().min(FONT_MIN_LEN),
		label: z.nativeEnum(LABEL_TYPE),
	});

	// info: can replace this by the entity itself, although it would be better to do so in the app service
	private constructor(readonly validData: NewThemeData) {
		super();
	}

	// info: either return the result directly, or unwrap it here to return control
	// to the outer layer and perform the transformations there
	static create(data: unknown): Result<NewThemeDto, DtoValidationError> {
		const validatedData = NewThemeDto.validate(NewThemeDto.schema, data);

		return validatedData.map((v) => new NewThemeDto(v));
	}
}

describe("when dto input", () => {
	const validData = {
		primaryColor: "#010203",
		secondaryColor: "#0304ef",
		primaryFont: "FiraCode NF",
		secondaryFont: "JetBrains Mono",
		label: LABEL_TYPE.DEFAULT,
	};

	describe("is okay", () => {
		const validData1 = {
			...validData,
		};

		const validData2 = {
			primaryColor: "#253845",
			secondaryColor: "#0908ae",
			primaryFont: "Hasklig",
			secondaryFont: "Meslo NF",
			label: LABEL_TYPE.RECTANGLE,
		};

		it("should return OK result with DTO when given valid data 1", () => {
			const dtoResult = NewThemeDto.create(validData1);

			assert.ok(dtoResult.isOk());

			const dto = dtoResult.unwrap();
			assert.ok(dto instanceof NewThemeDto);

			assert.deepStrictEqual(dto.validData, validData1);
		});

		it("should return OK result with DTO when given valid data 2", () => {
			const dtoResult = NewThemeDto.create(validData2);

			assert.ok(dtoResult.isOk());

			const dto = dtoResult.unwrap();
			assert.ok(dto instanceof NewThemeDto);

			assert.deepStrictEqual(dto.validData, validData2);
		});
	});

	describe("when given erroneous data", () => {
		it("return error for primaryColor", () => {
			const badData = { ...validData, primaryColor: "141458" };

			const dtoRes = NewThemeDto.create(badData);

			assert.ok(dtoRes.isErr());

			const dtoErr = dtoRes.unwrapErr();

			assert.ok(dtoErr instanceof DtoValidationError);

			assert.strictEqual(dtoErr.message, 'Validation error: String must contain exactly 7 character(s) at "primaryColor"');
		});

		it("should return error for secondaryColor", () => {
			const badData = { ...validData, secondaryColor: "141458" };

			const dtoRes = NewThemeDto.create(badData);

			assert.ok(dtoRes.isErr());

			const dtoErr = dtoRes.unwrapErr();

			assert.ok(dtoErr instanceof DtoValidationError);

			assert.deepStrictEqual(dtoErr.message, 'Validation error: String must contain exactly 7 character(s) at "secondaryColor"');
		});

		it("should return error for primaryFont", () => {
			const badData = { ...validData, primaryFont: "Fi" };

			const dtoRes = NewThemeDto.create(badData);

			assert.ok(dtoRes.isErr());

			const dtoErr = dtoRes.unwrapErr();

			assert.ok(dtoErr instanceof DtoValidationError);

			assert.deepStrictEqual(dtoErr.message, 'Validation error: String must contain at least 3 character(s) at "primaryFont"');
		});

		it("should return error for secondaryFont", () => {
			const badData = { ...validData, secondaryFont: "Fi" };

			const dtoRes = NewThemeDto.create(badData);

			assert.ok(dtoRes.isErr());

			const dtoErr = dtoRes.unwrapErr();

			assert.ok(dtoErr instanceof DtoValidationError);

			assert.strictEqual(dtoErr.message, 'Validation error: String must contain at least 3 character(s) at "secondaryFont"');
		});

		it("should return error for label", () => {
			const badData = { ...validData, label: "random" };

			const dtoRes = NewThemeDto.create(badData);

			assert.ok(dtoRes.isErr());

			const dtoErr = dtoRes.unwrapErr();

			assert.ok(dtoErr instanceof DtoValidationError);

			assert.deepStrictEqual(dtoErr.message, "Validation error: Invalid enum value. Expected 'default' | 'rounded' | 'rectangle', received 'random' at \"label\"");
		});

		it("should return multiple errors", () => {
			const badData = {
				primaryColor: "#123456789",
				secondaryColor: "#12145",
				primaryFont: "Fi",
				secondaryFont: "J",
				label: "random",
			};

			const dtoRes = NewThemeDto.create(badData);

			assert.ok(dtoRes.isErr());

			const dtoErr = dtoRes.unwrapErr();

			assert.ok(dtoErr instanceof DtoValidationError);

			assert.deepStrictEqual(dtoErr.message, 'Validation error: String must contain exactly 7 character(s) at "primaryColor"; String must contain exactly 7 character(s) at "secondaryColor"; String must contain at least 3 character(s) at "primaryFont"; String must contain at least 3 character(s) at "secondaryFont"; Invalid enum value. Expected \'default\' | \'rounded\' | \'rectangle\', received \'random\' at "label"');
		});
	});
});
