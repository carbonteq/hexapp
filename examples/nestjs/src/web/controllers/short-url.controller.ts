import {
  DeleteShortUrlDto,
  FetchUrlDto,
  NewShortUrlDto,
} from '@app/dtos/short-url.dto';
import { ShortUrlService } from '@app/services/short-url.service';
import { Logger } from '@carbonteq/hexapp';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

@Controller('/s')
export class ShortUrlController {
  constructor(readonly logger: Logger, readonly serv: ShortUrlService) {
    logger.setContext(ShortUrlController.name);
  }

  @Get()
  async getAll() {
    return await this.serv.all();
  }

  @Post()
  async createNew(@Body() body: string) {
    // unwrapping here as error interceptor will catch the error
    const dto = NewShortUrlDto.create(body).unwrap();

    return await this.serv.addNew(dto);
  }

  @Get("/:id")
  async fetchLongUrl(@Param('id') shortId: string) {
    const dto = FetchUrlDto.create(shortId).unwrap();

    return await this.serv.getLongVersion(dto);
  }

  @Delete('/:id')
  async deleteUrl(@Param('id') shortId: string) {
    const dto = DeleteShortUrlDto.create(shortId).unwrap();

    return await this.serv.getLongVersion(dto);
  }
}
