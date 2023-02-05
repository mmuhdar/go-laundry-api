import { Menu } from '@prisma/client';
import { Status } from '../../shared/enum';

export interface ResponseFindMenus {
  status: Status;
  message: string;
  content: Menu[];
}

export interface ResponseCommonMenu {
  status: Status;
  message: string;
  content: Menu;
}
