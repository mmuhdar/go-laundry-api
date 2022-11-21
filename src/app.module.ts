import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserModule } from './user/user.module';
import { BookingModule } from './booking/booking.module';
import { PrismaModule } from './prisma/prisma.module';
import { MenuModule } from './menu/menu.module';
import { LoggerMiddleware } from 'middlewares/logger.middleware';

@Module({
  imports: [UserModule, BookingModule, PrismaModule, MenuModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: 'booking',
      method: RequestMethod.GET,
    });
  }
}
