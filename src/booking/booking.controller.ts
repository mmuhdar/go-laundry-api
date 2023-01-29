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

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @Get('booking-code')
  getBookingByCode(@Query('code') code: string) {
    return this.bookingService.findBookingCode(code);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.bookingService.findById(id);
  }

  @Post()
  createBooking(@Body() createBooking: Prisma.BookingCreateInput) {
    return this.bookingService.createBooking(createBooking);
  }

  @Patch(':id')
  updateStatus(@Body('status') statusBooking: string, @Param('id') id: string) {
    return this.bookingService.updateStatus(statusBooking, id);
  }

  @Delete(':id')
  deleteBooking(@Param('id') id: string) {
    return this.bookingService.deleteBooking(id);
  }
}
