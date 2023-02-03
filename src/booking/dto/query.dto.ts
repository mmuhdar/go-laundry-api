import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BookingStatus } from '../enum';

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
