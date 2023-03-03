import { BaseDto, DtoValidationResult } from '@carbonteq/hexapp';
import { ShortUrlEntity } from '@domain/entities/short-url.entity';
import { z } from 'zod';

export class NewShortUrlDto extends BaseDto {
  private static readonly schema = z.object({
    url: z.string(),
  }); // url validation will be done by the VO

  constructor(readonly url: string) {
    super();
  }

  static create(data: unknown): DtoValidationResult<NewShortUrlDto> {
    const res = BaseDto.validate<{ url: string }>(NewShortUrlDto.schema, data);

    return res.map(({ url }) => new NewShortUrlDto(url));
  }
}

export class FetchUrlDto extends BaseDto {
  private static readonly schema = z.object({
    shortId: z.string().length(ShortUrlEntity.SURL_SIZE),
  });

  constructor(readonly shortId: string) {
    super();
  }

  static create(shortId: string): DtoValidationResult<FetchUrlDto> {
    const res = BaseDto.validate(FetchUrlDto.schema, { shortId });

    return res.map((_) => new FetchUrlDto(shortId));
  }
}

export class DeleteShortUrlDto extends BaseDto {
  private static readonly schema = z.object({
    shortId: z.string().length(ShortUrlEntity.SURL_SIZE),
  }); // The size validation can be offloaded to the VO

  constructor(readonly shortId: string) {
    super();
  }

  static create(shortId: string): DtoValidationResult<DeleteShortUrlDto> {
    const res = DeleteShortUrlDto.validate(DeleteShortUrlDto.schema, {
      shortId,
    });

    return res.map((_) => new DeleteShortUrlDto(shortId));
  }
}
