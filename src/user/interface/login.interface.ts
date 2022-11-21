import { Status } from 'shared/enum/status.enum';

export interface LoginInterface {
  status: Status;
  message: string;
  content: {
    token: string;
  };
}
