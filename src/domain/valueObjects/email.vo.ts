import { ZodUtils } from '../../shared/zod.utils';
import { ValidationError } from '../base.errors';
import { BaseValueObject } from './base.vo';
import { Result } from '@carbonteq/fp';
import { z } from 'zod';

export class InvalidEmail extends ValidationError {
  constructor(emailStr: string) {
    super(`<${emailStr}>`);
  }
}

export class EmailVo extends BaseValueObject<string> {
  private constructor(readonly email: string) {
    super();
  }

  static fromStrNoValidation(email: string): EmailVo {
    return new EmailVo(email);
  }

  static fromStr(email: string): Result<EmailVo, InvalidEmail> {
    return ZodUtils.safeParseResult(
      EMAIL_SCHEMA,
      email,
      (_) => new InvalidEmail(email),
    );
  }

  serialize(): string {
    return this.email;
  }
}

export const EMAIL_SCHEMA = z
  .string()
  .email()
  .transform<EmailVo>(EmailVo.fromStrNoValidation);
