import { Module } from '@nestjs/common';
import { ShortUrlService } from './services/short-url.service';

const services = [ShortUrlService];

@Module({
  providers: [...services],
  exports: [...services]
})
export class AppModule { }
