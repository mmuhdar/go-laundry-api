import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleUser } from './enum/role-user.enum';
import { Status } from '../shared/enum/status.enum';
import { LoginInterface, RegisterInterface } from './interface';
import {
  createToken,
  errorHandler,
  excludeField,
  checkPassword,
  hashPassword,
} from '../utils';
import { UserDto } from './dto';
import { TokenPayloadInterface } from '../shared/interface';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async register(registerUser: UserDto): Promise<RegisterInterface> {
    try {
      const { username, email, password } = registerUser;

      // hash password before insert to db
      const hashedPassword = await hashPassword(password);

      const data = await this.prisma.user.create({
        data: {
          username: username,
          email: email,
          password: hashedPassword,
          role: RoleUser.MEMBER,
        },
      });

      // erase field of the api response
      excludeField(data, ['password', 'createdAt', 'updateAt']);

      return {
        status: Status.SUCCESS,
        message: `Success create user`,
        content: data,
      };
    } catch (error) {
      errorHandler(error);
    }
  }

  async login(loginuser: UserDto): Promise<LoginInterface> {
    try {
      const { username, password } = loginuser;

      const found = await this.prisma.user.findUnique({ where: { username } });

      if (!found) throw new UnauthorizedException('Email/Password is wrong!');

      const isMatch = await checkPassword(password, found.password);

      if (!isMatch) throw new UnauthorizedException('Email/Password is wrong!');

      const tokenPayload: TokenPayloadInterface = {
        id: found.id,
        email: found.email,
        username: found.username,
        role: found.role,
      };

      const token = await createToken(tokenPayload);

      return {
        status: Status.SUCCESS,
        message: 'Login Success',
        content: {
          token,
        },
      };
    } catch (error) {
      errorHandler(error);
    }
  }
}
