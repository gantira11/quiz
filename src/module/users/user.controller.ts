import { 
  Controller, 
  UsePipes, 
  ValidationPipe, 
  Body, 
  Post,
  Res, 
  HttpStatus,
  Headers,
  Get,
  Query,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/utils/decorators';
import JwtAuthGuard from 'src/utils/guards/jwt-auth.guard';
import { responseError, responseSuccess } from 'src/utils/response';
import { PaginationParams } from 'src/utils/dto/pagination-dto';
import { UserService } from './user.service';
import { CreateUserDTO, GetDetailUserDTO, LoginDTO, UpdateUserDTO } from './dto';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { HeaderParamsDTO } from 'src/utils/dto/header-params-dto';
import { RoleService } from '../roles/role.service';

const moment = require('moment');

@ApiTags('[Users]')
@Controller('user')
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService
  ) {}

  @Post('/create')
  @ApiOperation({ summary: 'Create User' })
  @UsePipes(ValidationPipe)
  async create(@Body() body: CreateUserDTO, @Res() res) {
    let response = {}, statusCode = 500
    try {
      let payload = body
      const check = await this.userService.check(payload.username)

      if(!!check) {
        response = responseError(202, 'Username is already used')
        return res.status(202).json(response)
      }

      const role = await this.roleService.detail(payload.role_id)

      if(!role) {
        response = responseError(404, 'Role is not found!')
        return res.status(404).json(response)
      } 

      payload.password = await bcrypt.hash(body.password, 10)

      const process = await this.userService.create(body)

      if(!process) {
        response = responseError(statusCode, 'Internal Server Error')
      } else {
        statusCode = HttpStatus.OK;
        response = responseSuccess(statusCode, 'Success', process)
      }

      res.status(statusCode).json(response);
    } catch (error) {
      response = responseError(statusCode, error)
      res.status(statusCode).json(response)
    }
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login User' })
  @UsePipes(ValidationPipe)
  async login(@Headers() headers: HeaderParamsDTO, @Body() body: LoginDTO, @Res() res) {
    let response = {}, statusCode = 500
    try {
      let process: any = await this.userService.login(body.username, body.password)

      if(process.status === 200) {
        let isAdmin = false
        statusCode = process.status

        if(process.data.role.name === 'admin') isAdmin = true
        process.data.token = await this.jwtService.sign({...process.data})

        if(headers.platform === 'web' && !isAdmin) {
          statusCode = HttpStatus.BAD_REQUEST;
          response = responseError(statusCode, 'Access Not Allowed');
        } else {
          response = responseSuccess(statusCode, process.message, process.data);
        }
      }

      res.status(statusCode).json(response);
    } catch (error) {
      response = responseError(statusCode, error)
      res.status(statusCode).json(response)
    }
  }

  @Get('list')
  @ApiOperation({ summary: 'List User' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async list(@Query() param: PaginationParams, @Res() res) {
  let response = {}, statusCode = 500
    try {
      const process = await this.userService.list(param)

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
  @ApiOperation({ summary: 'Detail User' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async detail(@Param() param: GetDetailUserDTO, @Res() res) {
    let response = {}, statusCode = 500
    try {
      const process = await this.userService.detail(param.id)

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
  @ApiOperation({ summary: 'Update User' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async update(
    @Param() param: GetDetailUserDTO,
    @Body() body: UpdateUserDTO,
    @AuthUser() auth_user,
    @Res() res
  ) {
    let response = {}, statusCode = 500

    try {
      if(!!body.username && auth_user.username !== body.username) {
        const check = await this.userService.check(body.username)

        if(!!check) {
          response = responseError(202, 'Username is already used')
          return res.status(202).json(response)
        }
      }

      if(!!body.role_id && auth_user.role_id !== body.role_id) {
        const role = await this.roleService.detail(body.role_id)

        if(!role) {
          response = responseError(404, 'Role is not found!')
          return res.status(404).json(response)
        }
      }

      const process = await this.userService.update(param.id, body)

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
  @ApiOperation({ summary: 'Detail User' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async delete(@Param() param: GetDetailUserDTO, @Res() res) {
    let response = {}, statusCode = 500
    try {
      const process = await this.userService.delete(param.id)

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