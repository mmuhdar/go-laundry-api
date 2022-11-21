import { RoleUser } from '../enum/role-user.enum';

export class RegisterUser {
  email: string;
  password: string;
  role?: RoleUser;
  username?: string;
}
