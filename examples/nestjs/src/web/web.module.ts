import { Module } from '@nestjs/common';
import infraModules from '@infra/infra.modules';
import { HealthController, ShortUrlController } from './controllers';
import { AppModule } from '@app/app.module';

@Module({
  imports: [...infraModules, AppModule],
  controllers: [HealthController, ShortUrlController]
})
export class WebModule { }
