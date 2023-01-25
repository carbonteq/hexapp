import { BaseEntity, IEntity } from '@carbonteq/hexapp';
import {
  InvalidUrlError,
  IURL,
  URL as URLVo,
} from '@domain/value-objects/url.vo';
import { nanoid } from 'nanoid';
import { Result } from 'oxide.ts';

export interface IShortUrl extends IEntity {
  url: IURL;
  shortId: string;
}

export class ShortUrlEntity extends BaseEntity implements IShortUrl {
  static readonly SURL_SIZE = 8;

  private _url: URLVo;

  private constructor(readonly shortId: string, url: URLVo) {
    super();

    this._url = url;
  }

  static create(url: string): Result<ShortUrlEntity, InvalidUrlError> {
    const u = URLVo.create(url);

    const sUrl = u.map((validUrl) => {
      const shortId = nanoid(ShortUrlEntity.SURL_SIZE);

      return new ShortUrlEntity(shortId, validUrl);
    });

    return sUrl;
  }

  get url(): string {
    return this._url.url;
  }

  static from(other: IShortUrl): ShortUrlEntity {
    const u = URLVo.from(other.url);
    const ent = new ShortUrlEntity(other.shortId, u);

    ent._copyBaseProps(other);

    return ent;
  }

  serialize(): IShortUrl {
    return {
      ...super._serialize(),
      shortId: this.shortId,
      url: this._url.serialize(),
    };
  }
}
