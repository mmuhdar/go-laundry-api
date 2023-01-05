import { BookingStatus } from 'shared/enum/booking-status.enum';

export interface BookingInterface {
  id: string;
  name: string;
  address: string;
  bookingCode: string;
  status: BookingStatus;
  createdAt: string;
  updatedAr: string;
}
