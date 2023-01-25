import { AppResult, Monadic } from '@carbonteq/hexapp';
import { IShortUrl, ShortUrlEntity } from '@domain/entities/short-url.entity';
import { ShortUrlRepository } from '@domain/entities/short-url.repository';
import { Injectable } from '@nestjs/common';
import {
  NewShortUrlDto,
  FetchUrlDto,
  DeleteShortUrlDto,
} from '../dtos/short-url.dto';

// Anemic Domain - Just throwing data around

@Injectable()
export class ShortUrlService {
  constructor(private readonly repo: ShortUrlRepository) { }

  async all(): Promise<AppResult<IShortUrl[]>> {
    const a = await this.repo.fetchAll();
    const res = a.map((urls) => urls.map((u) => u.serialize()));

    return AppResult.fromResult(res);
  }

  async addNew({ url }: NewShortUrlDto): Promise<AppResult<IShortUrl>> {
    const ent = ShortUrlEntity.create(url);

    const insertRes = await Monadic.bindAsync(ent, async (e) => {
      return await this.repo.insert(e);
    });

    return AppResult.fromResult(insertRes.map((e) => e.serialize()));
  }

  async getLongVersion({ shortId }: FetchUrlDto): Promise<AppResult<string>> {
    const fetchRes = await this.repo.fetchByShortId(shortId);

    const res = fetchRes.map((e) => e.url);

    return AppResult.fromResult(res);
  }

  async deleteExisting({ shortId }: DeleteShortUrlDto): Promise<
    AppResult<IShortUrl>
  > {
    const deleteRes = await this.repo.deleteByShortId(shortId);

    const res = deleteRes.map((e) => e.serialize());

    return AppResult.fromResult(res);
  }
}
