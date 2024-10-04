import { SignupDto } from './dto/signup-auth.dto';
import { ConfigService } from '@nestjs/config';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { responseData } from 'src/utils/response';
import { tokenMajors } from 'src/config/jwt';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { hashPassword } from 'src/utils/hashPassword';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  prisma = new PrismaClient();
  // CHUNG
  async signup(res: Response, signupDto: SignupDto) {
    try {
      const duplicatedUsername = await this.prisma.users.findFirst({
        where: { username: signupDto.username },
      });

      if (duplicatedUsername) {
        throw new HttpException(
          'Tên đăng nhập đã tồn taị.',
          HttpStatus.CONFLICT,
        );
      }

      const duplicatedEmail = await this.prisma.users.findFirst({
        where: { email: signupDto.email },
      });

      if (duplicatedEmail) {
        throw new HttpException('Email đã tồn taị.', HttpStatus.CONFLICT);
      }

      // hash password
      let registerUser = {
        ...signupDto,
        password: hashPassword(signupDto.password),
      };

      // bcrypt

      await this.prisma.users.create({ data: registerUser });
      responseData(
        res,
        'Đăng ký tài khoản thành công.',
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
        'Đã có lỗi xảy ra - với tính năng đăng ký.',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ADMIN
  async loginAdmin(res: Response, loginDto: LoginDto) {
    try {
      // KIEM TRA USERNAME
      const foundUser = await this.prisma.users.findUnique({
        where: { username: loginDto.username },
      });
      if (!foundUser) {
        throw new HttpException(
          'Tên đăng nhập không đúng.',
          HttpStatus.NOT_FOUND,
        );
      }

      // KIEM TRA PASSWORD
      if (!compareSync(loginDto.password, foundUser.password)) {
        throw new HttpException(
          'Mật khẩu không đúng.',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      // THANH CONG => TAO TOKEN => GUI CHO USER
      const key = new Date().getTime();

      const token = await this.jwtService.sign(
        { data: { user_id: foundUser.user_id, key } },
        {
          expiresIn: '7d',
          secret: this.configService.get('SECRET_KEY_TOKEN'),
        },
      );

      // THANH CONG => UPDATE LAST LOGIN
      await this.prisma.users.update({
        where: {
          user_id: foundUser.user_id,
        },
        data: {
          ...foundUser,
          last_login: new Date(),
        },
      });

      responseData(res, 'Đăng nhập thành công.', token, HttpStatus.ACCEPTED);
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
        'Đã có lỗi xảy ra - với tính năng đăng nhập .',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
