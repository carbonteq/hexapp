import { Module } from '@nestjs/common';
import infraModules from '@infra/infra.modules';
import { HealthController } from './controllers/health.controller';

@Module({
  imports: [...infraModules],
  controllers: [HealthController]
})
export class WebModule { }
