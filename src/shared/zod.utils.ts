import { z } from 'zod';

export class ZodUtils {
  static readonly BUFFER_SCHEMA = z.custom<Buffer>(
    (data: unknown) => Buffer.isBuffer(data),
    { message: 'Buffer expected' },
  );
}
