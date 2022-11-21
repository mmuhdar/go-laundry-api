import * as jwt from 'jsonwebtoken';
import { TokenInterface } from 'shared/interface/token.interface';

export const createToken = (payload: TokenInterface): string => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
