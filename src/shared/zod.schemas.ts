/**
 * Zod Utilities
 * @module
 */

import { z } from "zod";
import { EMAIL_SCHEMA, type EmailVo } from "../domain/valueObjects/email.vo";
import { UUID_SCHEMA } from "../domain/valueObjects/uuid.vo";
import type { UUIDVo } from "../domain/valueObjects/uuid.vo";

export const STRING_SCHEMA: z.ZodType<string> = z.string();
export const OPTIONAL_STR_SCHEMA: z.ZodType<string | undefined> =
	STRING_SCHEMA.optional();
export const URL_SCHEMA: z.ZodType<string> = z.string().url();
export const NON_EMPTY_STRING: z.ZodType<string> = z.string().min(1);
export const NUMBER_SCHEMA: z.ZodType<number> = z.coerce.number();
export const BOOL_SCHEMA: z.ZodType<boolean> = z.coerce.boolean();
export const STRICT_BOOLEAN_SCHEMA: z.ZodType<boolean> = z.boolean();
export const STRICT_NUMBER_SCHEMA: z.ZodType<number> = z.number();

// export const QUERY_SCHEMA = STRING_SCHEMA.default("").transform(
// 	nodeqs.unescape,
// );

type JsonLiteral = string | number | boolean | null;
// Could add date here
const jsonLiteralSchema: z.ZodType<JsonLiteral> = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.null(),
]);
// type JsonLiteral = z.infer<typeof jsonLiteralSchema>;
type Json = JsonLiteral | { [key: string]: Json } | Json[];
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
	z.union([jsonLiteralSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);

interface ZodSchemas {
	STR: z.ZodType<string>;
	OPTIONAL_STR: z.ZodType<string | undefined>;
	URL: z.ZodType<string>;
	NON_EMPTY_STRING: z.ZodType<string>;
	NUMBER: z.ZodType<number>;
	BOOL: z.ZodType<boolean>;
	STRICT_BOOL: z.ZodType<boolean>;
	STRICT_NUM: z.ZodType<number>;
	BUFFER: z.ZodType<Buffer>;
	UUID: z.ZodType<UUIDVo, z.ZodTypeDef, string>;
	EMAIL: z.ZodType<EmailVo, z.ZodTypeDef, string>;
	JSON_LITERAL: z.ZodType<JsonLiteral>;
	JSON: z.ZodType<Json>;
}

/** Collection of commonly used Zod schemas */
export const ZodSchemas: ZodSchemas = {
	STR: STRING_SCHEMA,
	OPTIONAL_STR: OPTIONAL_STR_SCHEMA,
	URL: URL_SCHEMA,
	NON_EMPTY_STRING,
	NUMBER: NUMBER_SCHEMA,
	BOOL: BOOL_SCHEMA,
	STRICT_BOOL: STRICT_BOOLEAN_SCHEMA,
	STRICT_NUM: STRICT_NUMBER_SCHEMA,
	// QUERY: QUERY_SCHEMA,

	BUFFER: z.custom<Buffer>((data: unknown) => Buffer.isBuffer(data), {
		message: "Buffer expected",
	}),

	UUID: UUID_SCHEMA, // To prevent circular import issues
	EMAIL: EMAIL_SCHEMA,
	JSON_LITERAL: jsonLiteralSchema,
	JSON: jsonSchema as z.ZodType<Json>,
} as const;
