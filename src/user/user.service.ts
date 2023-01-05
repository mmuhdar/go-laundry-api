import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { RoleUser } from './enum/role-user.enum';
import { Status } from 'shared/enum/status.enum';
import { LoginInterface, RegisterInterface } from './interface';
import { checkPassword, hashPassword } from 'utils/bcrypt';
import { TokenInterface } from 'shared/interface/token.interface';
import { createToken } from 'utils/jwt';
import { errorHandler } from 'utils/errorHandler';
import { isEmail } from 'utils/emailChecker';
import { excludeUser } from 'utils/excludeField';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // async validator(form): Promise<Prisma.UserCreateInput> {
  //   const { username, email, password } = form;
  //   const hashedPassword = await hashPassword(password);
  //   return Prisma.validator<Prisma.UserCreateInput>()({
  //     username,
  //     email,
  //     password: hashedPassword,
  //     role: RoleUser.MEMBER,
  //   });
  // }

  async register(
    registerUser: Prisma.UserCreateInput,
  ): Promise<RegisterInterface> {
    try {
      const { username, email, password } = registerUser;

      if (!username || !email || !password)
        throw new BadRequestException('Please fill all field');
      if (!isEmail(email))
        throw new BadRequestException('Please input valid email');

      const hashedPassword = await hashPassword(password);

      const data = await this.prisma.user.create({
        data: {
          ...registerUser,
          username: username,
          email: email,
          password: hashedPassword,
          role: RoleUser.MEMBER,
        },
        // data: this.validator(registerUser),
      });
      excludeUser(data, ['password', 'createdAt', 'updateAt']);
      return {
        status: Status.SUCCESS,
        message: `Success create user`,
        content: data,
      };
    } catch (error) {
      errorHandler(error);
    }
  }

  async login(loginuser: Prisma.UserCreateInput): Promise<LoginInterface> {
    try {
      const { username, password } = loginuser;

      const found = await this.prisma.user.findUnique({ where: { username } });

      if (!found) throw new UnauthorizedException('Email/Password is wrong!');

      const isMatch = await checkPassword(password, found.password);

      if (!isMatch) throw new UnauthorizedException('Email/Password is wrong!');

      const tokenPayload: TokenInterface = {
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
