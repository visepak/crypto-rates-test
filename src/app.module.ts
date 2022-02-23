import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_CONFIG } from './app.config';
import { HttpController } from './controller/http.controller';
import { PriceService } from './service/price.service';
import { PriceEntity } from './orm/entity/price.entity';
import { CryptoCompareApiService } from './service/cryptocompare.api';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigEntity } from './orm/entity/config.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      {
        name: 'default',
        type: 'postgres',
        host: DB_CONFIG.host,
        port: DB_CONFIG.port,
        username: DB_CONFIG.username,
        password: DB_CONFIG.password,
        database: DB_CONFIG.database,
        entities: [`${__dirname}/orm/entity/*.entity{.ts,.js}`],
        migrations: [`${__dirname}/orm/migration/*{.ts,.js}`],
        logging: false,
        synchronize: false,
      }
    ),
    TypeOrmModule.forFeature([PriceEntity, ConfigEntity]),
    ScheduleModule.forRoot(),

  ],
  controllers: [HttpController],
  providers: [PriceService, CryptoCompareApiService],
})
export class AppModule { }
