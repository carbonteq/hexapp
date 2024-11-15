import { z } from "zod";
// import nodeqs from "node:querystring";

export const STRING_SCHEMA = z.string();
export const OPTIONAL_STR_SCHEMA = STRING_SCHEMA.optional();
export const URL_SCHEMA = z.string().url();
export const NON_EMPTY_STRING = z.string().min(1);
export const NUMBER_SCHEMA = z.coerce.number();
export const BOOL_SCHEMA = z.coerce.boolean();
export const STRICT_BOOLEAN_SCHEMA = z.boolean();
export const STRICT_NUMBER_SCHEMA = z.number();

// export const QUERY_SCHEMA = STRING_SCHEMA.default("").transform(
// 	nodeqs.unescape,
// );

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
  STR: STRING_SCHEMA,
  OPTIONAL_STR: OPTIONAL_STR_SCHEMA,
  URL: URL_SCHEMA,
  NON_EMPTY_STRING,
  NUMBER: NUMBER_SCHEMA,
  BOOL: BOOL_SCHEMA,
  STRICT_BOOL: STRICT_BOOLEAN_SCHEMA,
  STRICT_NUM: STRICT_NUMBER_SCHEMA,
  // QUERY: QUERY_SCHEMA,

  BUFFER_SCHEMA: z.custom<Buffer>((data: unknown) => Buffer.isBuffer(data), {
    message: "Buffer expected",
  }),

  DATE_SCHEMA: z.date(),

  JSON_LITERAL_SCHEMA: jsonLiteralSchema,
  JSON_SCHEMA: jsonSchema as z.ZodType<Json>,
} as const;
