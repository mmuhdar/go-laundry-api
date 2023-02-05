import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminMiddleware } from '../middlewares/admin.middleware';

@Module({
  imports: [PrismaModule],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminMiddleware)
      .exclude(
        {
          path: 'booking/booking-code',
          method: RequestMethod.GET,
        },
        {
          path: 'booking',
          method: RequestMethod.GET,
        },
      )
      .forRoutes(BookingController);
  }
}
