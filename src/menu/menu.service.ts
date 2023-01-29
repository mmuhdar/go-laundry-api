import { Injectable } from '@nestjs/common';

@Injectable()
export class MenuService {
  //   constructor(private prisma: PrismaService);
  async findAll(): Promise<any> {
    return {
      status: 'success call menu',
    };
  }

  async findById(id: string): Promise<any> {
    return {
      status: `success call menu with ID ${id}`,
    };
  }
}
