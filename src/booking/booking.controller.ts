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
import { query } from 'express';
import { User } from 'shared/decorator';
import { BookingService } from './booking.service';
import { QueryCode, QueryDto } from './dto';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Get()
  findAll(@Query() dto: QueryDto) {
    return this.bookingService.findAll(dto);
  }

  @Get('booking-code')
  getBookingByCode(@Query() query: QueryCode) {
    return this.bookingService.findBookingCode(query);
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
  updateStatus(
    @Body('status') status: string,
    @Param('id') id: string,
    @User() user: any,
  ) {
    return this.bookingService.updateStatus({ status, id, user });
  }

  @Delete(':id')
  deleteBooking(@Param('id') id: string) {
    return this.bookingService.deleteBooking(id);
  }
}
