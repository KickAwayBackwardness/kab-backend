import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TypesService } from './types.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('types')
export class TypesController {
  constructor(private readonly typesService: TypesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  createType(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createType: CreateTypeDto,
  ) {
    return this.typesService.createType(req, res, createType);
  }

  @Get('get-all')
  getAllTypes(@Res() res: Response) {
    return this.typesService.getAllTypes(res);
  }

  @Get('get-one/:type_id')
  getOneType(@Param('type_id') type_id: number, @Res() res: Response) {
    return this.typesService.getOneType(type_id, res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update/:type_id')
  updateType(
    @Param('type_id') type_id: number,
    @Body() updateTypeDto: UpdateTypeDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.typesService.updateType(req, res, type_id, updateTypeDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('inactive/:type_id')
  inactiveType(
    @Param('type_id') type_id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.typesService.inactiveType(req, res, type_id);
  }
}
