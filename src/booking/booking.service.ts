import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import { BookingStatus } from './enum';
import { Status } from 'shared/enum/status.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateBookingCode } from 'utils';
import { errorHandler, excludeField } from 'utils';
import {
  ResponseCommonBooking,
  ResponseCreateBooking,
  ResponseFindBookings,
  UpdateStatusInterface,
} from './interface';
import { BookingDto, QueryCode, QueryDto } from './dto';

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

  async findAll(query: QueryDto): Promise<ResponseFindBookings> {
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

  async findById(id: string): Promise<ResponseCommonBooking> {
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

  async createBooking(
    createBooking: BookingDto,
  ): Promise<ResponseCreateBooking> {
    try {
      const { name, address, totalPrice, email, menuId } = createBooking;

      const bookingCode = generateBookingCode();

      const data = await this.prisma.booking.create({
        data: {
          name,
          address,
          email,
          bookingCode,
          totalPrice: Number(totalPrice),
          status: BookingStatus.PROGRESS,
          menuId,
        },
      });

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SENDER_MAIL,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Go Laundry" <${process.env.SENDER_MAIL}>`,
        to: email,
        subject: 'Booking Code',
        text: 'Booking Code',
        html: `
        <h4>Hi, ${name}</h4>
        <h4>This is your booking code <i style="color:blue;"><u>${bookingCode}</u></i></h4>
        `,
      });

      return {
        status: Status.SUCCESS,
        message: `Succuss create booking. Check your email for get booking code.`,
        content: { bookingCode: data.bookingCode },
      };
    } catch (error) {
      errorHandler(error);
    }
  }

  async findBookingCode(query: QueryCode): Promise<any> {
    try {
      const data = await this.prisma.booking.findUnique({
        where: { bookingCode: query.code },
        include: {
          menu: true,
        },
      });
      if (!data)
        throw new NotFoundException(`No data with booking code ${query.code}`);
      return {
        status: Status.SUCCESS,
        message: `Success get data with booking code ${query.code}`,
        content: data,
      };
    } catch (error) {
      errorHandler(error);
    }
  }

  async updateStatus({
    dto,
    id,
    user,
  }: UpdateStatusInterface): Promise<ResponseCommonBooking> {
    try {
      await this.checkBookingId(id);
      if (!dto.status)
        throw new BadRequestException('Please input status field');
      const data = await this.prisma.booking.update({
        where: { id },
        data: { status: dto.status, userId: user.id },
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

  async deleteBooking(id: string): Promise<ResponseCommonBooking> {
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
