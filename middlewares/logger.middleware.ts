import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { verifyToken } from 'utils/jwt';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req, res: Response, next: NextFunction) {
    const bearer = req.header('authorization');
    if (!bearer)
      throw new HttpException('Login First', HttpStatus.UNAUTHORIZED);
    const token = bearer.split(' ')[1];
    try {
      const { id } = await verifyToken(token);
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new UnauthorizedException('Token Invalid, Please login first');
      } else {
        const userPayload = {
          id: user.id,
          role: user.role,
          email: user.email,
          username: user.username,
        };
        req.user = userPayload;
        next();
      }
    } catch (error) {
      next(error);
    }
  }
}
