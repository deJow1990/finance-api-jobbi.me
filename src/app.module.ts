import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { DatabaseConfig } from './config/database.interface';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PasswordModule } from './password/password.module';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', load: [configuration] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const dbConfig = config.get<DatabaseConfig>('database');
        return {
          type: 'postgres',
          url: dbConfig?.url,
          autoLoadEntities: dbConfig?.autoLoadEntities,
          synchronize: dbConfig?.synchronize,
          entities: ['dist/**/*.entity.js'],
        }
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    PasswordModule,
    CategoriesModule,
    TransactionsModule
  ],
})
export class AppModule {}