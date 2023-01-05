import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { LoggerMiddleware } from 'middlewares/logger.middleware';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MenuController } from './menu.controller';

@Module({
  imports: [PrismaModule],
  controllers: [MenuController],
})
export class MenuModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: 'menu',
      method: RequestMethod.ALL,
    });
  }
}
