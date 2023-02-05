import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  async register(@Body() dto: UserDto) {
    return this.userService.register(dto);
  }

  @Post('/login')
  async login(@Body() dto: UserDto) {
    return this.userService.login(dto);
  }
}
