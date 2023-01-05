import { Status } from 'shared/enum/status.enum';

export interface RegisterInterface {
  status: Status;
  message: string;
  content: object;
}
