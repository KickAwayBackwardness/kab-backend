import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { Request, Response } from 'express';
import { SignupDto } from './dto/signup-auth.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // CHUNG
  @Post('signup')
  signUp(@Res() res: Response, @Body() signupDto: SignupDto) {
    return this.authService.signup(res, signupDto);
  }

  // ADMIN
  @Post('admin/login')
  loginAdmin(@Res() res: Response, @Body() loginDto: LoginDto) {
    return this.authService.loginAdmin(res, loginDto);
  }
  // Check PERMISSION
  @UseGuards(AuthGuard('jwt'))
  @Post('admin/check-admin-permission')
  checkPermisson(@Req() req: Request, @Res() res: Response) {
    return this.authService.checkPermission(req, res);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
