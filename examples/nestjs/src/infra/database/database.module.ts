import { AppLoggerModule } from '../logger';
import { Module, Global } from '@nestjs/common';
import { ShortUrlRepoProvider } from './repositories/short-url.repository.in-memory';

const providers = [ShortUrlRepoProvider];

@Global()
@Module({
  imports: [AppLoggerModule],
  providers: [...providers],
  exports: [...providers]
})
export class DatabaseModule { }
