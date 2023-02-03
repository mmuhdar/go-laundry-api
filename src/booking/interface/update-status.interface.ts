import { TokenPayloadInterface } from 'shared/interface';
import { UpdateStatusDto } from '../dto/update-status.dto';

export interface UpdateStatusInterface {
  dto: UpdateStatusDto;
  id: string;
  user: TokenPayloadInterface;
}
