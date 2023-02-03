import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus } from 'shared/enum/booking-status.enum';
import { Status } from 'shared/enum/status.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateBookingCode } from 'utils/bookingCode';
import { errorHandler, excludeField } from 'utils';
import {
  GetBookingInterface,
  GetBookingsInterface,
  PostBookingInterface,
} from './interface/booking.interface';
import { QueryDto } from './dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async checkBookingId(id: string): Promise<any> {
    try {
      const data = await this.prisma.booking.findUnique({
        where: { id },
        include: {
          updatedBy: true,
        },
      });
      if (!data) throw new NotFoundException(`No data found with id ${id}`);
      return data;
    } catch (error) {
      errorHandler(error);
    }
  }

  async findAll(query: QueryDto): Promise<GetBookingsInterface> {
    try {
      const { status, name, bookingCode } = query;
      let data;

      if (!name && !status && !bookingCode) {
        data = await this.prisma.booking.findMany({
          include: {
            menu: true,
            updatedBy: true,
          },
        });
      } else {
        data = await this.prisma.booking.findMany({
          where: { name, status, bookingCode },
          include: {
            menu: true,
            updatedBy: true,
          },
        });
      }

      data.forEach((el) => {
        excludeField(el.updatedBy, [
          'password',
          'createdAt',
          'updateAt',
          'email',
        ]);
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
      excludeField(data.updatedBy, [
        'password',
        'createdAt',
        'updateAt',
        'email',
      ]);
      return {
        status: Status.SUCCESS,
        message: `Succes get data`,
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
        },
      });
      return {
        status: Status.SUCCESS,
        message: `Success get data with booking code ${bookingCode}`,
        content: data,
      };
    } catch (error) {
      errorHandler(error);
    }
  }

  async updateStatus({ status, id, user }): Promise<GetBookingInterface> {
    try {
      await this.checkBookingId(id);
      if (!status) throw new BadRequestException('Please input status field');
      const data = await this.prisma.booking.update({
        data: { status, userId: user.id },
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
