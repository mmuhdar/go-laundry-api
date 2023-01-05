import { Body, Controller, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  async register(@Body() registerUser: Prisma.UserCreateInput) {
    return this.userService.register(registerUser);
  }

  @Post('/login')
  async login(@Body() loginUser: Prisma.UserCreateInput) {
    return this.userService.login(loginUser);
  }
}
