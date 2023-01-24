import { Logger } from '@carbonteq/hexapp';
import { Controller, Get } from '@nestjs/common';

@Controller('/health')
export class HealthController {
  constructor(readonly logger: Logger) {
    logger.setContext(HealthController.name);
  }

  @Get('/')
  async health() {
    this.logger.debug('lala');
    return { status: 'ok' };
  }
}
