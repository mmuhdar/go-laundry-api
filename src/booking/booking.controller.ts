import { Controller, Get } from '@nestjs/common';
import { USER } from 'shared/decorator/user.decorator';
import { UserDto } from 'shared/dto/user.dto';

@Controller('booking')
export class BookingController {
  @Get()
  findAll(@USER() user: UserDto): UserDto {
    return {
      ...user,
    };
  }
}
