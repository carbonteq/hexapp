import { EMAIL_SCHEMA } from '../domain/valueObjects/email.vo';
import { UUID_SCHEMA } from '../domain/valueObjects/uuid.vo';
import { z } from 'zod';

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

export class ZodSchemas {
  static readonly BUFFER_SCHEMA = z.custom<Buffer>(
    (data: unknown) => Buffer.isBuffer(data),
    { message: 'Buffer expected' },
  );

  static readonly DATE_SCHEMA = z.date();

  static readonly UUID_SCHEMA = UUID_SCHEMA; // To prevent circular import issues
  static readonly EMAIL_SCHEMA = EMAIL_SCHEMA;

  static readonly JSON_LITERAL_SCHEMA = jsonLiteralSchema;
  static readonly JSON_SCHEMA: z.ZodType<Json> = jsonSchema;
}
