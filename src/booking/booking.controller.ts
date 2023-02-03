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
import { User } from 'shared/decorator';
import { TokenPayloadInterface } from 'shared/interface';
import { BookingService } from './booking.service';
import { BookingDto, QueryCode, QueryDto } from './dto';
import { UpdateStatusDto } from './dto';

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
  createBooking(@Body() createBooking: BookingDto) {
    return this.bookingService.createBooking(createBooking);
  }

  @Patch(':id')
  updateStatus(
    @Body() dto: UpdateStatusDto,
    @Param('id') id: string,
    @User() user: TokenPayloadInterface,
  ) {
    return this.bookingService.updateStatus({ dto, id, user });
  }

  @Delete(':id')
  deleteBooking(@Param('id') id: string) {
    return this.bookingService.deleteBooking(id);
  }
}
