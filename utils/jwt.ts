import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { TokenInterface } from 'shared/interface/token.interface';

export const createToken = async (payload: TokenInterface): Promise<string> => {
  try {
    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '3h',
    });
    return token;
  } catch (error) {
    throw new InternalServerErrorException(error.message);
  }
};

export const verifyToken = async (token: string): Promise<any> => {
  const data = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      switch (err.name) {
        case 'TokenExpiredError':
          throw new UnauthorizedException('Token has expired, please Re-login');
        case 'JsonWebTokenError':
          throw new UnauthorizedException('Invalid Token');
        default:
          throw new InternalServerErrorException();
      }
    } else {
      return decoded;
    }
  });
  return data;
};
