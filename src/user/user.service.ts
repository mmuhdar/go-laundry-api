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
import { RegisterDto, LoginDto } from './dto';
import { TokenPayloadInterface } from '../shared/interface';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async register(registerUser: RegisterDto): Promise<RegisterInterface> {
    try {
      const { username, email, password, name } = registerUser;

      // hash password before insert to db
      const hashedPassword = await hashPassword(password);

      const data = await this.prisma.user.create({
        data: {
          username,
          name,
          email,
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

  async login(loginuser: LoginDto): Promise<LoginInterface> {
    try {
      const { email, password } = loginuser;

      const found = await this.prisma.user.findUnique({ where: { email } });

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
          name: found.name,
          email: found.email,
        },
      };
    } catch (error) {
      errorHandler(error);
    }
  }
}
