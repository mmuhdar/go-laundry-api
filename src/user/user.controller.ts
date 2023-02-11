import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto, RegisterDto } from './dto';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  async register(@Body() dto: RegisterDto) {
    return this.userService.register(dto);
  }

  @Post('/login')
  async login(@Body() dto: LoginDto) {
    return this.userService.login(dto);
  }
}
