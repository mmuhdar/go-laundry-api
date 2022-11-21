import { RoleUser } from 'src/user/enum/role-user.enum';

export class UserDto {
  id: string;
  username: string;
  email: string;
  role: RoleUser;
}
