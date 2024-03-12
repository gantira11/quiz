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
  HttpException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/utils/decorators';
import JwtAuthGuard from 'src/utils/guards/jwt-auth.guard';
import { responseError, responseSuccess } from 'src/utils/response';
import { PaginationParams } from 'src/utils/dto/pagination-dto';
import { HeaderParamsDTO } from 'src/utils/dto/header-params-dto';
import { QuizService } from './quiz.service';
import { CreateSubjectDTO, ParamsId, UpdateSubjectDTO, UpdateVideosPayload } from './dto/index.dto';

const moment = require('moment');

@ApiTags('[Quizzes]')
@Controller('')
@ApiBearerAuth()
export class QuizController {
  constructor(
    private readonly quizService: QuizService
  ) {}

  @Post('/create-subject')
  @ApiOperation({ summary: 'Create Subject' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async create(@Body() body: CreateSubjectDTO, @AuthUser() auth_user, @Res() res) {
    let response = {}, statusCode = 500
    try {
      if(auth_user.role.name !== 'admin') throw new HttpException('Access Not Allowed', HttpStatus.BAD_REQUEST)
      const process = await this.quizService.subjectCreate(body)

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

  @Get('subject-list')
  @ApiOperation({ summary: 'List Subject' })
  @UsePipes(ValidationPipe)
  async subjectList(@Query() param: PaginationParams, @Res() res) {
    let response = {}, statusCode = 500
    try {
      const process = await this.quizService.subjectList(param)

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

  @Get('subject-detail/:id')
  @ApiOperation({ summary: 'Detail Subject' })
  @UsePipes(ValidationPipe)
  async subjectDetail(@Param() param: ParamsId, @Res() res) {
    let response = {}, statusCode = 500
    try {
      const process = await this.quizService.subjectDetail(param.id)

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

  @Put('subject-update/:id')
  @ApiOperation({ summary: 'Update Subject' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async subjectUpdate(@Param() param: ParamsId, @Body() body: UpdateSubjectDTO, @AuthUser() auth_user, @Res() res) {
    let response = {}, statusCode = 500
    try {
      if(auth_user.role.name !== 'admin') throw new HttpException('Access Not Allowed', HttpStatus.BAD_REQUEST)
      const process = await this.quizService.subjectUpdate(param.id, body)

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

  @Delete('subject-delete/:id')
  @ApiOperation({ summary: 'Delete Subject' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async subjectDelete(@Param() param: ParamsId, @AuthUser() auth_user, @Res() res) {
    let response = {}, statusCode = 500
    try {
      if(auth_user.role.name !== 'admin') throw new HttpException('Access Not Allowed', HttpStatus.BAD_REQUEST)
      const process = await this.quizService.subjectDelete(param.id)

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

  @Get('video-detail/:id')
  @ApiOperation({ summary: 'Detail Video' })
  @UsePipes(ValidationPipe)
  async videoDetail(@Param() param: ParamsId, @Res() res) {
    let response = {}, statusCode = 500
    try {
      const process = await this.quizService.videoDetail(param.id)

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

  @Put('video-update/:id')
  @ApiOperation({ summary: 'Update Video' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async videoUpdate(@Param() param: ParamsId, @Body() body: UpdateVideosPayload, @AuthUser() auth_user, @Res() res) {
    let response = {}, statusCode = 500
    try {
      if(auth_user.role.name !== 'admin') throw new HttpException('Access Not Allowed', HttpStatus.BAD_REQUEST)
      const process = await this.quizService.videoUpdate(param.id, body)

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

  @Delete('video-delete/:id')
  @ApiOperation({ summary: 'Delete Video' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async videoDelete(@Param() param: ParamsId, @AuthUser() auth_user, @Res() res) {
    let response = {}, statusCode = 500
    try {
      if(auth_user.role.name !== 'admin') throw new HttpException('Access Not Allowed', HttpStatus.BAD_REQUEST)
      const process = await this.quizService.videoDelete(param.id)

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