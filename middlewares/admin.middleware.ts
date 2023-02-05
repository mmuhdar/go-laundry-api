import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { verifyToken } from 'utils/jwt';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
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
      if (user.role !== 'ADMIN') {
        throw new ForbiddenException('You are not allowance to do this action');
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  }
}
