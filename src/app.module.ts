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
import { BookingController } from './booking/booking.controller';
import { MenuController } from './menu/menu.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    BookingModule,
    PrismaModule,
    MenuModule,
    ConfigModule.forRoot(),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude(
        {
          path: 'booking/booking-code',
          method: RequestMethod.GET,
        },
        {
          path: 'menu',
          method: RequestMethod.GET,
        },
      )
      .forRoutes(BookingController, MenuController);
  }
}
