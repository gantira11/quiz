import { 
  Controller, 
  UsePipes, 
  ValidationPipe, 
  Body, 
  Post,
  Res, 
  UseGuards,
  HttpStatus,
  Param,
  Get,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/utils/decorators';
import JwtAuthGuard from 'src/utils/guards/jwt-auth.guard';
import { responseError, responseSuccess } from 'src/utils/response';
import { CreateRoleDTO, GetDetailDTO } from './dto/index.dto';
import { Logger } from 'nestjs-pino';
import { RoleService } from './role.service';
import { PaginationParams } from 'src/utils/dto/pagination-dto';

const moment = require('moment');

@ApiTags('[Role]')
@Controller('role')
@ApiBearerAuth()
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly logger: Logger
  ) {}

  @Post('/create')
  @ApiOperation({ summary: 'Create Role' })
  @UsePipes(ValidationPipe)
  async create(@Body() body: CreateRoleDTO, @AuthUser() auth_user, @Res() res) {
    let response = {}, statusCode = 500
    try {
      const process = await this.roleService.create(body)

      if(!process) {
        response = responseError(statusCode, 'Internal Server Error');
      } else {
        statusCode = HttpStatus.OK;
        response = responseSuccess(statusCode, 'Success', process);
      }

      res.status(statusCode).json(response);
    } catch (error) {
      response = responseError(statusCode, error)
      res.status(statusCode).json(response)
    }
  }

  @Get('list')
  @ApiOperation({ summary: 'List Role' })
  @UsePipes(ValidationPipe)
  async list(@Query() param: PaginationParams, @Res() res) {
    let response = {}, statusCode = 500
    try {
      const process = await this.roleService.list(param)

      if(!process) {
        response = responseError(statusCode, 'Internal Server Error');
      } else {
        statusCode = HttpStatus.OK;
        response = responseSuccess(statusCode, 'Success', process);
      }

      res.status(statusCode).json(response);
    } catch (error) {
      response = responseError(statusCode, error)
      res.status(statusCode).json(response)
    }
  }

  @Get('detail/:id')
  @ApiOperation({ summary: 'Detail Role' })
  @UsePipes(ValidationPipe)
  async detail(@Param() param: GetDetailDTO, @Res() res) {
    let response = {}, statusCode = 500
    try {
      const process = await this.roleService.detail(param.id)

      if(!process) {
        response = responseError(statusCode, 'Internal Server Error');
      } else {
        statusCode = HttpStatus.OK;
        response = responseSuccess(statusCode, 'Success', process);
      }

      res.status(statusCode).json(response);
    } catch (error) {
      response = responseError(statusCode, error)
      res.status(statusCode).json(response)
    }
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Update Role' })
  @UsePipes(ValidationPipe)
  async update(@Param() param: GetDetailDTO, @Body() body: CreateRoleDTO, @Res() res) {
    let response = {}, statusCode = 500
    try {
      const process = await this.roleService.update(param.id, body)

      if(!process) {
        response = responseError(statusCode, 'Internal Server Error');
      } else {
        statusCode = HttpStatus.OK;
        response = responseSuccess(statusCode, 'Success', process);
      }

      res.status(statusCode).json(response);
    } catch (error) {
      response = responseError(statusCode, error)
      res.status(statusCode).json(response)
    }
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Detail Role' })
  @UsePipes(ValidationPipe)
  async delete(@Param() param: GetDetailDTO, @Res() res) {
    let response = {}, statusCode = 500
    try {
      const process = await this.roleService.delete(param.id)

      if(!process) {
        response = responseError(statusCode, 'Internal Server Error');
      } else {
        statusCode = HttpStatus.OK;
        response = responseSuccess(statusCode, 'Success', process);
      }

      res.status(statusCode).json(response);
    } catch (error) {
      response = responseError(statusCode, error)
      res.status(statusCode).json(response)
    }
  }
}