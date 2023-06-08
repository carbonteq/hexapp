import { Result } from '@carbonteq/fp';
import { BaseValueObject } from './base.vo';
import { randomUUID } from 'node:crypto';
import { ValidationError } from '../base.exception';
import { ZodUtils } from '@carbonteq/hexapp/shared/zod.utils';

export class InvalidUUIDError extends ValidationError {
  constructor(uuid_str: string) {
    super(`Invalid UUID <${uuid_str}>`);
  }
}

export class UUIDVo extends BaseValueObject<string> {
  private constructor(private readonly uuid_str: string) {
    super();
  }

  static new(): UUIDVo {
    const uuid_str = randomUUID();

    return new UUIDVo(uuid_str);
  }

  static from_str_no_validation(uuid: string): UUIDVo {
    return new UUIDVo(uuid);
  }

  static from_str(uuid_candidate: string): Result<UUIDVo, InvalidUUIDError> {
    const validationResult = ZodUtils.UUID_SCHEMA.safeParse(uuid_candidate);

    if (validationResult.success) {
      return Result.Ok(new UUIDVo(uuid_candidate));
    } else {
      return Result.Err(new InvalidUUIDError(uuid_candidate));
    }
  }

  serialize(): string {
    return this.uuid_str;
  }

  toString(): string {
    return `UUID<${this.uuid_str}>`;
  }
}
