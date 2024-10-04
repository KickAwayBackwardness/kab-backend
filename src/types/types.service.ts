import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { responseData } from 'src/utils/response';
import { tokenMajors } from 'src/config/jwt';

@Injectable()
export class TypesService {
  prisma = new PrismaClient();

  async createType(req: Request, res: Response, createType: CreateTypeDto) {
    try {
      const { authorization } = req.headers;
      const token = authorization.replace('Bearer ', '');
      const { user_id }: any = tokenMajors.decodeToken(token).data;

      const user = await this.prisma.users.findUnique({ where: { user_id } });
      // xac dinh token hop le khong
      if (!user) {
        throw new HttpException(
          'Vui lòng đăng nhập để tiếp tục.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // xac dinh co quyen try cap khong
      if (user.permission_id !== 1) {
        return responseData(
          res,
          'Bạn không có quyền truy cập.',
          false,
          HttpStatus.FORBIDDEN,
        );
      }

      // kiem tra trung
      const duplicate = await this.prisma.types.findFirst({
        where: { type_name: createType.type_name },
      });
      if (duplicate) {
        throw new HttpException(
          'Loại bài viết đã tồn tại',
          HttpStatus.CONFLICT,
        );
      }

      await this.prisma.types.create({ data: createType });
      responseData(
        res,
        'Thêm mới loại bài viết thành công.',
        null,
        HttpStatus.CREATED,
      );
    } catch (exception) {
      if (exception.status !== 500) {
        return responseData(
          res,
          exception.response || 'Đã có lỗi xảy ra.',
          null,
          exception.status || 400,
        );
      }
      responseData(
        res,
        'Đã có lỗi xảy ra - với tính năng thêm loại bài viết.',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllTypes(res: Response) {
    try {
      const types = await this.prisma.types.findMany();
      if (!types) {
        throw new HttpException(
          'Không tìm thấy danh sách loại bài viết.',
          HttpStatus.NOT_FOUND,
        );
      }
      responseData(
        res,
        'Lấy danh sách loại bài viết thành công.',
        types,
        HttpStatus.ACCEPTED,
      );
    } catch (exception) {
      if (exception.status !== 500) {
        return responseData(
          res,
          exception.response || 'Đã có lỗi xảy ra.',
          null,
          exception.status || 400,
        );
      }
      responseData(
        res,
        'Đã có lỗi xảy ra - với tính năng lấy danh sách loại bài viết.',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} type`;
  }

  update(id: number, updateTypeDto: UpdateTypeDto) {
    return `This action updates a #${id} type`;
  }

  remove(id: number) {
    return `This action removes a #${id} type`;
  }
}
