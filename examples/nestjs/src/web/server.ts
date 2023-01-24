import { Logger as PinoLogger } from 'nestjs-pino';
import { createApp, configureAppForDevProd } from './app.configure';
import config from '@infra/config';

async function bootstrap() {
  const app = await createApp();

  const logger = app.get(PinoLogger);

  configureAppForDevProd(app);
  const port = config.app.PORT;

  await app.listen(port, '0.0.0.0', async () => {
    logger.log(`App is up at http://localhost:${port}`);
  });
}
bootstrap();
