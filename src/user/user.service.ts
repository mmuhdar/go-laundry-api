import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { RoleUser } from './enum/role-user.enum';
import { Status } from 'shared/enum/status.enum';
import { LoginInterface, RegisterInterface } from './interface';
import { checkPassword, hashPassword } from 'utils/bcrypt';
import { TokenInterface } from 'shared/interface/token.interface';
import { createToken } from 'utils/jwt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async register(
    registerUser: Prisma.UserCreateInput,
  ): Promise<RegisterInterface> {
    try {
      const { username, email, password } = registerUser;

      const hashedPassword = await hashPassword(password);
      console.log(hashedPassword), '<====';

      const data = await this.prisma.user.create({
        data: {
          ...registerUser,
          username: username,
          email: email,
          password: hashedPassword,
          role: RoleUser.MEMBER,
        },
      });

      return {
        status: Status.SUCCESS,
        message: `Success create user ${data.username}`,
      };
    } catch (error) {
      console.log(error);
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

      const token = createToken(tokenPayload);

      return {
        status: Status.SUCCESS,
        message: 'Login Success',
        content: {
          token,
        },
      };
    } catch (error) {
      return error;
    }
  }
}
