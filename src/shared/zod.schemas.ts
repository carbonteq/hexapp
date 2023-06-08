import { EMAIL_SCHEMA } from '../domain/valueObjects/email.vo';
import { UUID_SCHEMA } from '../domain/valueObjects/uuid.vo';
import { z } from 'zod';

export class ZodSchemas {
  static readonly BUFFER_SCHEMA = z.custom<Buffer>(
    (data: unknown) => Buffer.isBuffer(data),
    { message: 'Buffer expected' },
  );

  static readonly DATE_SCHEMA = z.date();

  static readonly UUID_SCHEMA = UUID_SCHEMA; // To prevent circular import issues
  static readonly EMAIL_SCHEMA = EMAIL_SCHEMA;
}
