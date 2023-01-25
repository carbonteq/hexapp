import { BaseValueObject, ValidationError } from '@carbonteq/hexapp';
import { Ok, Result, Err } from 'oxide.ts';
import { URL as NodeURL } from 'node:url';

const isValidUrl = (url: string): boolean => {
  try {
    new NodeURL(url);

    return true;
  } catch (err) {
    return false;
  }
};

export class InvalidUrlError extends ValidationError {
  constructor(url: string) {
    super('url', url);
  }
}

export type IURL = string;

export class URL extends BaseValueObject<IURL> {
  private constructor(readonly url: string) {
    super();
  }

  static create(url: string): Result<URL, InvalidUrlError> {
    if (!isValidUrl(url)) return Err(new InvalidUrlError(url));

    return Ok(new URL(url));
  }

  static from(other: IURL): URL {
    return new URL(other);
  }

  serialize(): IURL {
    return this.url;
  }
}
