import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus } from 'shared/enum/booking-status.enum';
import { Status } from 'shared/enum/status.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateBookingCode } from 'utils/bookingCode';
import { errorHandler } from 'utils/errorHandler';
import { excludeUser } from 'utils/excludeField';
import {
  GetBookingInterface,
  GetBookingsInterface,
  PostBookingInterface,
} from './interface/booking.interface';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async checkBookingId(id: string): Promise<any> {
    try {
      const data = await this.prisma.booking.findUnique({ where: { id } });
      if (!data) throw new NotFoundException(`No data found with id ${id}`);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<GetBookingsInterface> {
    try {
      const data = await this.prisma.booking.findMany({
        include: {
          finishedBy: true,
          menu: true,
        },
      });
      data.forEach((el) => {
        if (el.userId) {
          excludeUser(el.finishedBy, [
            'password',
            'createdAt',
            'updateAt',
            'email',
          ]);
        }
      });
      return {
        status: Status.SUCCESS,
        message: 'Success get all data',
        content: data,
      };
    } catch (error) {
      errorHandler(error);
    }
  }

  async findById(id: string): Promise<GetBookingInterface> {
    try {
      const data = await this.checkBookingId(id);
      excludeUser(data.finishedBy, [
        'password',
        'createdAt',
        'updateAt',
        'email',
      ]);
      return {
        status: Status.SUCCESS,
        message: `Succes get data with ID ${id}`,
        content: data,
      };
    } catch (error) {
      throw error;
    }
  }

  async createBooking(createBooking: any): Promise<PostBookingInterface> {
    try {
      const { name, address, totalPrice } = createBooking;
      const bookingCode = generateBookingCode();
      const data = await this.prisma.booking.create({
        data: {
          ...createBooking,
          name,
          address,
          bookingCode,
          totalPrice: Number(totalPrice),
          status: BookingStatus.PROGRESS,
        },
      });
      return {
        status: Status.SUCCESS,
        message: `Succuss create booking`,
        content: { bookingCode: data.bookingCode },
      };
    } catch (error) {
      errorHandler(error);
    }
  }

  async findBookingCode(bookingCode: any): Promise<any> {
    try {
      const data = await this.prisma.booking.findUnique({
        where: { bookingCode },
        include: {
          menu: true,
          finishedBy: true,
        },
      });
      if (data.userId) {
        excludeUser(data.finishedBy, [
          'password',
          'createdAt',
          'updateAt',
          'email',
        ]);
      }
      return {
        status: Status.SUCCESS,
        message: `Success get data with booking code ${bookingCode}`,
        content: data,
      };
    } catch (error) {
      errorHandler(error);
    }
  }

  async updateStatus(status: string, id: string): Promise<GetBookingInterface> {
    try {
      await this.checkBookingId(id);
      if (!status) throw new BadRequestException('Please input status field');
      const data = await this.prisma.booking.update({
        data: { status },
        where: { id },
      });
      return {
        status: Status.SUCCESS,
        message: `Success update status`,
        content: data,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteBooking(id: string): Promise<GetBookingInterface> {
    try {
      await this.checkBookingId(id);
      const data = await this.prisma.booking.delete({ where: { id } });
      return {
        status: Status.SUCCESS,
        message: `Success delete data`,
        content: data,
      };
    } catch (error) {
      throw error;
    }
  }
}
