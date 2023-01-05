import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BookingService } from './booking.service';
// import { GetBookingsInterface } from './interface/booking.interface';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Get()
  async findAll(@Query('bookingCode') bookingCode: string) {
    if (bookingCode) {
      return this.bookingService.findBookingCode(bookingCode);
    } else {
      return this.bookingService.findAll();
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.bookingService.findById(id);
  }

  @Post()
  async createBooking(@Body() createBooking: Prisma.BookingCreateInput) {
    return this.bookingService.createBooking(createBooking);
  }

  @Patch(':id')
  async updateStatus(
    @Body('status') statusBooking: string,
    @Param('id') id: string,
  ) {
    return this.bookingService.updateStatus(statusBooking, id);
  }

  @Delete(':id')
  async deleteBooking(@Param('id') id: string) {
    return this.bookingService.deleteBooking(id);
  }
}
