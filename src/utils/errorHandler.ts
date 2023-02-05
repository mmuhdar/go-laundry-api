import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

export const errorHandler = (err: any): void => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        const key = err.meta?.target;
        throw new ConflictException(`${key} already used`);
      default:
        throw new InternalServerErrorException();
    }
  } else {
    throw err;
  }
};
