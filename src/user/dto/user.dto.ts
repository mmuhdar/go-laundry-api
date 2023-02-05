import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { RoleUser } from '../enum/role-user.enum';

export class RegisterUser {
  email: string;
  password: string;
  role?: RoleUser;
  username?: string;
}

// refactor UserDto
export class UserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsEnum(RoleUser)
  role?: RoleUser;

  @IsNotEmpty()
  @IsString()
  username: string;
}
