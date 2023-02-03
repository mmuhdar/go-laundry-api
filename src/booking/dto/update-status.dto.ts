import { IsEnum } from 'class-validator';
import { BookingStatus } from '../enum';

export class UpdateStatusDto {
  @IsEnum(BookingStatus)
  status: string;
}
