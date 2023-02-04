import { IsEmail, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class BookingDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  totalPrice: number;

  @IsNotEmpty()
  @IsString()
  menuId: string;
}
