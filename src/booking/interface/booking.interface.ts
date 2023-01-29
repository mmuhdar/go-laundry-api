import { Status } from 'shared/enum/status.enum';
import { Booking } from '@prisma/client';

export interface GetBookingsInterface {
  status: Status;
  message: string;
  content: Booking[];
}

export interface GetBookingInterface {
  status: Status;
  message: string;
  content: Booking;
}

export interface PostBookingInterface {
  status: Status;
  message: string;
  content: {
    bookingCode: string;
  };
}
