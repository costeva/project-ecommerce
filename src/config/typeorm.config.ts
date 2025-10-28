import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions} from '@nestjs/typeorm';
import { join } from 'path';

export const typeOrmConfig=(configService:ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USER'),
  password: configService.get<string>('DATABASE_PASS'),
  database: configService.get<string>('DATABASE_NAME'),
  autoLoadEntities: true,
  ssl: { rejectUnauthorized: false },
  synchronize: true,
  logging: true,
  entities:[join(__dirname + '../../**/*.entity{.ts,.js}')],
})
