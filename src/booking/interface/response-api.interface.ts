import { Status } from '../../shared/enum/status.enum';
import { Booking } from '@prisma/client';

export interface ResponseFindBookings {
  status: Status;
  message: string;
  content: Booking[];
}

export interface ResponseCommonBooking {
  status: Status;
  message: string;
  content: Booking;
}

export interface ResponseCreateBooking {
  status: Status;
  message: string;
  content: {
    bookingCode: string;
  };
}
