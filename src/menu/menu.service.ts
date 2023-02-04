import { Injectable, NotFoundException } from '@nestjs/common';
import { Status } from 'shared/enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { errorHandler } from 'utils';
import { MenuDto, UpdateMenuDto } from './dto/menu.dto';
import { ResponseCommonMenu, ResponseFindMenus } from './interface';

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

  async checkingMenuId(id: string): Promise<any> {
    try {
      const data = await this.prisma.menu.findUnique({
        where: { id },
        include: { bookings: true },
      });

      if (!data) throw new NotFoundException('No data found');

      return data;
    } catch (error) {
      errorHandler(error);
    }
  }

  async findById(id: string): Promise<ResponseCommonMenu> {
    try {
      const data = await this.checkingMenuId(id);

      return {
        status: Status.SUCCESS,
        message: 'Success get data',
        content: data,
      };
    } catch (error) {
      errorHandler(error);
    }
  }

  async createMenu(dto: MenuDto): Promise<ResponseCommonMenu> {
    try {
      const { name, estimateDay, price } = dto;
      const data = await this.prisma.menu.create({
        data: {
          name,
          estimateDay,
          price: Number(price),
        },
      });

      return {
        status: Status.SUCCESS,
        message: 'Success create data',
        content: data,
      };
    } catch (error) {
      errorHandler(error);
    }
  }

  async updateMenu(
    id: string,
    dto: UpdateMenuDto,
  ): Promise<ResponseCommonMenu> {
    try {
      const { name, estimateDay, price } = dto;

      const found = await this.checkingMenuId(id);

      if (found) {
        const data = await this.prisma.menu.update({
          where: { id },
          data: {
            name,
            estimateDay,
            price: Number(price),
          },
        });

        return {
          status: Status.SUCCESS,
          message: 'Success update data',
          content: data,
        };
      }
    } catch (error) {
      errorHandler(error);
    }
  }

  async deleteMenu(id: string): Promise<ResponseCommonMenu> {
    try {
      await this.checkingMenuId(id);

      const data = await this.prisma.menu.delete({
        where: { id },
      });

      return {
        status: Status.SUCCESS,
        message: 'Success delete data',
        content: data,
      };
    } catch (error) {
      errorHandler(error);
    }
  }
}
