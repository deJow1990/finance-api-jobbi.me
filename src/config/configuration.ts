import { AppConfig } from './app.interface';
import { DatabaseConfig } from './database.interface';
export default () => ({
  app: {
    port: parseInt(process.env.PORT ?? '3001', 10),
    jwtKey: process.env.JWT_KEY || '',
    validHosts: process.env.VALID_HOSTS ? process.env.VALID_HOSTS.split(',') : [],
  } as AppConfig,
  database: {
    url: process.env.DATABASE_URL || '',
    autoLoadEntities: process.env.AUTO_LOAD_ENTITTIES === 'true',
    synchronize: process.env.RUN_MIGRATIONS === 'true',
  } as DatabaseConfig
});
