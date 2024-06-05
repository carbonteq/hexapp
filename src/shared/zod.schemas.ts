import { z } from "zod";
import { EMAIL_SCHEMA } from "../domain/valueObjects/email.vo";
import { UUID_SCHEMA } from "../domain/valueObjects/uuid.vo";

// Could add date here
const jsonLiteralSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.null(),
]);
type JsonLiteral = z.infer<typeof jsonLiteralSchema>;
type Json = JsonLiteral | { [key: string]: Json } | Json[];
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
	z.union([jsonLiteralSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);

export const ZodSchemas = {
	BUFFER_SCHEMA: z.custom<Buffer>((data: unknown) => Buffer.isBuffer(data), {
		message: "Buffer expected",
	}),

	DATE_SCHEMA: z.date(),

	UUID_SCHEMA: UUID_SCHEMA, // To prevent circular import issues
	EMAIL_SCHEMA: EMAIL_SCHEMA,

	JSON_LITERAL_SCHEMA: jsonLiteralSchema,
	JSON_SCHEMA: jsonSchema as z.ZodType<Json>,
};
