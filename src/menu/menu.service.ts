import { Injectable } from '@nestjs/common';
import { Status } from 'shared/enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { errorHandler } from 'utils';
import { ResponseFindMenus } from './interface';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}
  async findAll(): Promise<ResponseFindMenus> {
    try {
      const data = await this.prisma.menu.findMany();
      return {
        status: Status.SUCCESS,
        message: 'Success get data',
        content: data,
      };
    } catch (error) {
      errorHandler(error);
    }
  }

  async findById(id: string): Promise<any> {
    return {
      status: `success call menu with ID ${id}`,
    };
  }
}
