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
import { QuizService } from './quiz.service';
import { CreateAnswerDTO, CreateQuizzesDTO, CreateSubjectDTO, ParamsId, UpdateQuetionDTO, UpdateQuizzesDTO, UpdateSubjectDTO, UpdateVideosDTO } from './dto/index.dto';

const moment = require('moment');

@ApiTags('[Quizzes]')
@Controller('')
@ApiBearerAuth()
export class QuizController {
  constructor(
    private readonly quizService: QuizService
  ) {}

  @Get('/dashboard')
  @ApiOperation({ summary: 'Get Dashboard' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async dashboard(@AuthUser() auth_user, @Res() res) {
    let response = {}, statusCode = 500
    try {
      if(auth_user.role.name !== 'admin') throw new HttpException('Access Not Allowed', HttpStatus.BAD_REQUEST)
      const process = await this.quizService.dashboard()

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
  async videoUpdate(@Param() param: ParamsId, @Body() body: UpdateVideosDTO, @AuthUser() auth_user, @Res() res) {
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

  @Post('/create-quizzes')
  @ApiOperation({ summary: 'Create Quizzes' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async quizCreate(@Body() body: CreateQuizzesDTO, @AuthUser() auth_user, @Res() res) {
    let response = {}, statusCode = 500
    try {
      if(auth_user.role.name !== 'admin') throw new HttpException('Access Not Allowed', HttpStatus.BAD_REQUEST)
      const process = await this.quizService.quizCreate(body)

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

  @Get('quiz-list')
  @ApiOperation({ summary: 'List Quizzes' })
  @UsePipes(ValidationPipe)
  async quizList(@Query() param: PaginationParams, @Res() res) {
    let response = {}, statusCode = 500
    try {
      const process = await this.quizService.quizList(param)

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

  @Get('quiz-detail/:id')
  @ApiOperation({ summary: 'Detail Quizzes' })
  @UsePipes(ValidationPipe)
  async quizDetail(@Param() param: ParamsId, @Res() res) {
    let response = {}, statusCode = 500
    try {
      const process = await this.quizService.quizDetail(param.id)

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

  @Put('quiz-update/:id')
  @ApiOperation({ summary: 'Update Quizzes' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async quizUpdate(@Param() param: ParamsId, @Body() body: UpdateQuizzesDTO, @AuthUser() auth_user, @Res() res) {
    let response = {}, statusCode = 500
    try {
      if(auth_user.role.name !== 'admin') throw new HttpException('Access Not Allowed', HttpStatus.BAD_REQUEST)
      const process = await this.quizService.quizUpdate(param.id, body)

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

  @Delete('quiz-delete/:id')
  @ApiOperation({ summary: 'Delete Quizzes' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async quizDelete(@Param() param: ParamsId, @AuthUser() auth_user, @Res() res) {
    let response = {}, statusCode = 500
    try {
      if(auth_user.role.name !== 'admin') throw new HttpException('Access Not Allowed', HttpStatus.BAD_REQUEST)
      const process = await this.quizService.quizDelete(param.id)

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

  @Get('quetion-detail/:id')
  @ApiOperation({ summary: 'Detail Quetion' })
  @UsePipes(ValidationPipe)
  async quetionDetail(@Param() param: ParamsId, @Res() res) {
    let response = {}, statusCode = 500
    try {
      const process = await this.quizService.quetionDetail(param.id)

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

  @Put('quetion-update/:id')
  @ApiOperation({ summary: 'Update Quetion' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async quetionUpdate(@Param() param: ParamsId, @Body() body: UpdateQuetionDTO, @AuthUser() auth_user, @Res() res) {
    let response = {}, statusCode = 500
    try {
      if(auth_user.role.name !== 'admin') throw new HttpException('Access Not Allowed', HttpStatus.BAD_REQUEST)
      const process = await this.quizService.quetionUpdate(param.id, body)

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

  @Delete('quetion-delete/:id')
  @ApiOperation({ summary: 'Delete Quetion' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async quetionDelete(@Param() param: ParamsId, @AuthUser() auth_user, @Res() res) {
    let response = {}, statusCode = 500
    try {
      if(auth_user.role.name !== 'admin') throw new HttpException('Access Not Allowed', HttpStatus.BAD_REQUEST)
      const process = await this.quizService.quetionDelete(param.id)

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

  @Get('option-detail/:id')
  @ApiOperation({ summary: 'Detail Options' })
  @UsePipes(ValidationPipe)
  async optionDetail(@Param() param: ParamsId, @Res() res) {
    let response = {}, statusCode = 500
    try {
      const process = await this.quizService.optionDetail(param.id)

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

  @Put('option-update/:id')
  @ApiOperation({ summary: 'Update Options' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async optionUpdate(@Param() param: ParamsId, @Body() body: UpdateQuetionDTO, @AuthUser() auth_user, @Res() res) {
    let response = {}, statusCode = 500
    try {
      if(auth_user.role.name !== 'admin') throw new HttpException('Access Not Allowed', HttpStatus.BAD_REQUEST)
      const process = await this.quizService.optionUpdate(param.id, body)

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

  @Delete('option-delete/:id')
  @ApiOperation({ summary: 'Delete Options' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async optionDelete(@Param() param: ParamsId, @AuthUser() auth_user, @Res() res) {
    let response = {}, statusCode = 500
    try {
      if(auth_user.role.name !== 'admin') throw new HttpException('Access Not Allowed', HttpStatus.BAD_REQUEST)
      const process = await this.quizService.optionDelete(param.id)

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

  @Post('/create-answer')
  @ApiOperation({ summary: 'Create Answers' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async answerCreate(@Body() body: CreateAnswerDTO, @AuthUser() auth_user, @Res() res) {
    let response = {}, statusCode = 500
    try {
      const process = await this.quizService.answerCreate(auth_user.id, body)

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

  @Get('answer-list')
  @ApiOperation({ summary: 'List Answers' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async answerList(@Query() param: PaginationParams, @AuthUser() auth_user,  @Res() res) {
    let response = {}, statusCode = 500
    try {
      const process = await this.quizService.answerList(param, auth_user)

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

  @Get('answer-detail/:id')
  @ApiOperation({ summary: 'Detail Answers' })
  @UsePipes(ValidationPipe)
  async answerDetail(@Param() param: ParamsId, @Res() res) {
    let response = {}, statusCode = 500
    try {
      const process = await this.quizService.answerDetail(param.id)

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