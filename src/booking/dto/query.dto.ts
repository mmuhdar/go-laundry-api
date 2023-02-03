import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BookingStatus } from 'shared/enum/booking-status.enum';

export class QueryDto {
  @IsOptional()
  @IsString()
  bookingCode?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
