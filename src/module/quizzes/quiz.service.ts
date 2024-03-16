import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Subjects } from 'src/schema/subjects.entity';
import { Videos } from 'src/schema/videos.entity';
import {
  CreateAnswerPayload,
  CreateQuizzesPayload,
  CreateSubjectPayload,
  UpdateOptionPayload,
  UpdateQuetionPayload,
  UpdateQuizzessPayload,
  UpdateSubjectPayload,
  UpdateVideoPayload
} from 'src/interface/quiz.interface';
import { Quizzes } from 'src/schema/quizzes.entity';
import { Quetions } from 'src/schema/quetions.entity';
import { Options } from 'src/schema/options.entity';
import { Answers } from 'src/schema/answers.entity';

const moment = require('moment');

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Subjects)
    private subjectsRepository: Repository<Subjects>,
    @InjectRepository(Videos)
    private videosRepository: Repository<Videos>,
    @InjectRepository(Quizzes)
    private quizzesRepository: Repository<Quizzes>,
    @InjectRepository(Quetions)
    private quetionsRepository: Repository<Quetions>,
    @InjectRepository(Options)
    private optionsRepository: Repository<Options>,
    @InjectRepository(Answers)
    private answersRepository: Repository<Answers>,
  ) {}

  async subjectCreate(body: CreateSubjectPayload) {
    let result: any

    try {
      let videos = []
      let data = body
      data['created_at'] = moment.utc().format('YYYY-DD-MM HH:mm:ss')
      data['updated_at'] = moment.utc().format('YYYY-DD-MM HH:mm:ss')

      if(data.videos.length > 0) videos = data.videos

      const subject = await this.subjectsRepository.save(
        this.subjectsRepository.create(data)
      )

      if(!subject) throw new HttpException('Failed create subject data', HttpStatus.BAD_REQUEST)

      if(videos.length > 0) {
        videos = videos.map((item) => {
          item['subject_id'] = subject['id']
          item['created_at'] = moment.utc().format('YYYY-DD-MM HH:mm:ss')
          item['updated_at'] = moment.utc().format('YYYY-DD-MM HH:mm:ss')
          return item
        })

        await this.videosRepository
          .createQueryBuilder()
          .insert()
          .into(Videos)
          .values(videos)
          .execute()
      }

      result = subject
      result['videos'] = data.videos

      return result
    } catch (err) {
      throw new HttpException(err.message, err.code)
    }
  }

  async subjectList(params: any) {
    try {
      let page = params.page ? parseInt(params.page) : 1
      let limit = params.limit ? parseInt(params.limit) : 10

      let query = await this.subjectsRepository
        .createQueryBuilder('sub')
        .where('sub.deleted_at is null')

      if(!!params.keyword) {
        query.andWhere('sub.name like :name', {name: `%${params.keyword}%`})
      }

      let count = await query.getCount();
      let pageCount = Math.ceil(count / limit)

      if (page > pageCount) {
        page = page == 1 ? page : pageCount
      }

      const offset = page == 1 ? 0 : (page - 1) * limit

      let report = await query
        .take(limit)
        .skip(offset)
        .getMany();

      const slNo = page == 1 ? 0 : (page - 1) * limit - 1

      const paginator = {
        itemCount: count,
        limit: limit,
        pageCount: pageCount,
        page: page,
        slNo: slNo + 1,
        hasPrevPage: page > 1 ? true : false,
        hasNextPage: page < pageCount ? true : false,
        prevPage: page > 1 && page != 1 ? page - 1 : null,
        nextPage: page < pageCount ? page + 1 : null,
      };

      let result = {
        subjects: count > 0 ? report : [],
        paginator: paginator
      }

      return result
    } catch (err) {
      throw new HttpException(err.message, err.code)
    }
  }

  async subjectDetail(id: string) {
    return await this.subjectsRepository
      .createQueryBuilder('sub')
      .leftJoinAndSelect('sub.videos', 'vid')
      .leftJoinAndSelect('sub.quizzes', 'q')
      .where('sub.id = :id', {id})
      .andWhere('vid.deleted_at is null')
      .andWhere('q.deleted_at is null')
      .getOne()
  }

  async videoDetail(id: string) {
    return await this.videosRepository
      .createQueryBuilder('video')
      .where('video.id = :id', {id})
      .getOne()
  }

  async subjectUpdate(id: string, body: UpdateSubjectPayload) {
    try {
      let data = body
      data['updated_at'] = moment.utc().format('YYYY-MM-DD HH:mm:ss')

      return await this.subjectsRepository
        .createQueryBuilder()
        .update(Subjects)
        .set(data)
        .execute()
        .then(async (res) => {
          if(res.affected < 1) throw new HttpException('Failed to update data', HttpStatus.INTERNAL_SERVER_ERROR)
          return await this.subjectsRepository
            .createQueryBuilder('subject')
            .where('subject.id = :id', {id})
            .getOne()
        })
    } catch (err) {
      throw new HttpException(err.message, err.code)
    }
  }

  async videoUpdate(id: string, body: UpdateVideoPayload) {
    try {
      let data = body
      data['updated_at'] = moment.utc().format('YYYY-MM-DD HH:mm:ss')

      return await this.videosRepository
        .createQueryBuilder()
        .update(Subjects)
        .set(data)
        .execute()
        .then(async (res) => {
          if(res.affected < 1) throw new HttpException('Failed to update data', HttpStatus.INTERNAL_SERVER_ERROR)
          return await this.videosRepository
            .createQueryBuilder('video')
            .where('video.id = :id', {id})
            .getOne()
        })
    } catch (err) {
      throw new HttpException(err.message, err.code)
    }
  }

  async subjectDelete(id: string) {
    try {
      const data = {
        deleted_at: moment.utc().format('YYYY-DD-MM HH:mm:ss')
      }

      const subject = await this.subjectsRepository
        .createQueryBuilder('sub')
        .leftJoinAndSelect('sub.videos', 'vid')
        .leftJoinAndSelect('sub.quizzes', 'q')
        .leftJoinAndSelect('q.quetions', 'que')
        .leftJoinAndSelect('que.options', 'op')
        .where('sub.id = :id', {id})
        .andWhere('vid.deleted_at is null')
        .andWhere('q.deleted_at is null')
        .getOne()

      if(!subject) throw new HttpException('Subject is not found.', HttpStatus.NOT_FOUND)

      let videosIds = []
      let quizIds = []
      let quetionIds = []

      videosIds = subject.videos.map((e) => {
        return e.id
      })

      quizIds = subject.quizzes.map((e) => {
        quetionIds = e.quetions.map((e) => {
          return e.id
        })

        return e.id
      })

      await this.subjectsRepository
        .createQueryBuilder()
        .update(Subjects)
        .set(data)
        .where('id = :id', {id})
        .execute()
        .then(async (res) => {
          if(videosIds.length > 0) {
            await this.videosRepository
              .createQueryBuilder()
              .update(Videos)
              .set(data)
              .where('subject_id = :id', {id})
              .execute()
          }

          if(quizIds.length > 0) {
            await this.quizzesRepository
              .createQueryBuilder()
              .update(Quizzes)
              .set(data)
              .where('subject_id = :id', {id})
              .execute()

            if(quetionIds.length > 0) {
              await this.quetionsRepository
                .createQueryBuilder()
                .update(Quetions)
                .set(data)
                .where('quiz_id IN (:...id)', {id: quizIds})
                .execute()

              await this.optionsRepository
                .createQueryBuilder()
                .update(Options)
                .set(data)
                .where('quetion_id IN (:...id)', {id: quetionIds})
                .execute()
            }
          }

          return res
        })
        
      return true
    } catch (err) {
      throw new HttpException(err.message, err.code)
    }
  }

  async videoDelete(id: string) {
    try {
      const data = {
        deleted_at: moment.utc().format('YYYY-DD-MM HH:mm:ss')
      }

      return await this.videosRepository
        .createQueryBuilder()
        .update(Videos)
        .set(data)
        .where('id = :id', {id})
        .execute()

    } catch (err) {
      throw new HttpException(err.message, err.code)
    }
  }

  async quizCreate(body: CreateQuizzesPayload) {
    try {
      let quetions = []
      let data = body

      quetions = data.quetions
      delete data.quetions

      data['created_at'] = moment.utc().format('YYYY-DD-MM HH:mm:ss')
      data['updated_at'] = moment.utc().format('YYYY-DD-MM HH:mm:ss')

      const quiz = await this.quizzesRepository.save(
        this.quizzesRepository.create(data)
      )

      if(!quiz) throw new HttpException('Failed create quizzes data', HttpStatus.BAD_REQUEST)
      if(quetions.length > 0) {
        for(let item of quetions) {
          let options = []
          item['quiz_id'] = quiz.id
          item['created_at'] = moment.utc().format('YYYY-DD-MM HH:mm:ss')
          item['updated_at'] = moment.utc().format('YYYY-DD-MM HH:mm:ss')

          options = item.options
          delete item.options
          
          const quetion = await this.quetionsRepository.save(
            this.quetionsRepository.create(item)
          )

          if(!quetion) throw new HttpException('Failed create quetions data', HttpStatus.BAD_REQUEST)

          options = options.map((e) => {
            e['quetion_id'] = quetion['id']  
            e['created_at'] = moment.utc().format('YYYY-DD-MM HH:mm:ss')
            e['updated_at'] = moment.utc().format('YYYY-DD-MM HH:mm:ss')
            return e
          })

          await this.optionsRepository
            .createQueryBuilder()
            .insert()
            .into(Options)
            .values(options)
            .execute()
        }
      }

      return {quiz_id: quiz.id}
    } catch (err) {
      throw new HttpException(err.message, err.code)
    }
  }

  async quizList(params: any) {
    try {
      let page = params.page ? parseInt(params.page) : 1
      let limit = params.limit ? parseInt(params.limit) : 10

      let query = await this.quizzesRepository
        .createQueryBuilder('quiz')
        .where('quiz.deleted_at is null')

      if(!!params.keyword) {
        query.andWhere('quiz.name like :name', {name: `%${params.keyword}%`})
      }

      let count = await query.getCount();
      let pageCount = Math.ceil(count / limit)

      if (page > pageCount) {
        page = page == 1 ? page : pageCount
      }

      const offset = page == 1 ? 0 : (page - 1) * limit

      let report = await query
        .take(limit)
        .skip(offset)
        .getMany();

      const slNo = page == 1 ? 0 : (page - 1) * limit - 1

      const paginator = {
        itemCount: count,
        limit: limit,
        pageCount: pageCount,
        page: page,
        slNo: slNo + 1,
        hasPrevPage: page > 1 ? true : false,
        hasNextPage: page < pageCount ? true : false,
        prevPage: page > 1 && page != 1 ? page - 1 : null,
        nextPage: page < pageCount ? page + 1 : null,
      };

      let result = {
        quizzes: count > 0 ? report : [],
        paginator: paginator
      }

      return result
    } catch (err) {
      throw new HttpException(err.message, err.code)
    }
  }

  async quizDetail(id: string) {
    return await this.quizzesRepository
      .createQueryBuilder('quiz')
      .leftJoinAndSelect('quiz.quetions', 'que')
      .leftJoinAndSelect('que.options', 'op')
      .where('quiz.id = :id', {id})
      .getOne()
  }

  async quizUpdate(id: string, body: UpdateQuizzessPayload) {
    try {
      let data = body
      data['updated_at'] = moment.utc().format('YYYY-MM-DD HH:mm:ss')
  
      return await this.quetionsRepository
        .createQueryBuilder()
        .update(Quizzes)
        .set(data)
        .where('id = :id', {id})
        .execute()
    } catch (err) {
      throw new HttpException(err.message, err.code)
    }
  }

  async quizDelete(id: string) {
    try {
      const data = {
        deleted_at: moment.utc().format('YYYY-DD-MM HH:mm:ss')
      }

      const quizzes = await this.quizzesRepository
        .createQueryBuilder('quiz')
        .leftJoinAndSelect('quiz.quetions', 'que')
        .leftJoinAndSelect('que.options', 'op')
        .where('quiz.id = :id', {id})
        .getOne()

      if(!quizzes) throw new HttpException('Quizzes is not found.', HttpStatus.NOT_FOUND)

      let quetionIds = []
      quetionIds = quizzes.quetions.map((e) => { return e.id })

      await this.quizzesRepository
        .createQueryBuilder()
        .update(Quizzes)
        .set(data)
        .where('id = :id', {id})
        .execute()
        .then(async (res) => {
          if(quetionIds.length > 0) {
            await this.quetionsRepository
              .createQueryBuilder()
              .update(Quetions)
              .set(data)
              .where('quiz_id = :id', {id})
              .execute()
  
            await this.optionsRepository
              .createQueryBuilder()
              .update(Options)
              .set(data)
              .where('quetion_id IN (:...id)', {id: quetionIds})
              .execute()
          }

          return res
        })

      return true
    } catch (err) {
      throw new HttpException(err.message, err.code)
    }
  }

  async quetionDetail(id: string) {
    return await this.quetionsRepository
      .createQueryBuilder('que')
      .leftJoinAndSelect('que.options', 'op')
      .where('que.id = :id', {id})
      .getOne()
  }

  async quetionUpdate(id: string, body: UpdateQuetionPayload) {
    try {
      let data = body
      data['updated_at'] = moment.utc().format('YYYY-MM-DD HH:mm:ss')
  
      return await this.quetionsRepository
        .createQueryBuilder()
        .update(Quetions)
        .set(data)
        .where('id = :id', {id})
        .execute()
    } catch (err) {
      throw new HttpException(err.message, err.code)
    }
  }

  async quetionDelete(id: string) {
    try {
      const data = {
        deleted_at: moment.utc().format('YYYY-DD-MM HH:mm:ss')
      }

      const quetions = await this.quetionsRepository
        .createQueryBuilder('que')
        .leftJoinAndSelect('que.options', 'op')
        .where('que.id = :id', {id})
        .getOne()

      if(!quetions) throw new HttpException('Quetions is not found.', HttpStatus.NOT_FOUND)

      await this.quetionsRepository
        .createQueryBuilder()
        .update(Quetions)
        .set(data)
        .where('id = :id', {id})
        .execute()
        .then(async (res) => {
          await this.optionsRepository
            .createQueryBuilder()
            .update(Options)
            .set(data)
            .where('quetion_id :id', {id})
            .execute()

          return res
        })

      return true
    } catch (err) {
      throw new HttpException(err.message, err.code)
    }
  }

  async optionDetail(id: string) {
    return await this.optionsRepository
      .createQueryBuilder('op')
      .where('op.id = :id', {id})
      .getOne()
  }

  async optionUpdate(id: string, body: UpdateOptionPayload) {
    try {
      let data = body
      data['updated_at'] = moment.utc().format('YYYY-MM-DD HH:mm:ss')

      return await this.optionsRepository
        .createQueryBuilder()
        .update(Options)
        .set(data)
        .where('id = :id', {id})
        .execute()
    } catch (err) {
      throw new HttpException(err.message, err.code)
    }
  }

  async optionDelete(id: string) {
    try {
      const data = {
        deleted_at: moment.utc().format('YYYY-DD-MM HH:mm:ss')
      }

      return await this.optionsRepository
        .createQueryBuilder()
        .update(Options)
        .set(data)
        .where('id = :id', {id})
        .execute()

    } catch (err) {
      throw new HttpException(err.message, err.code)
    }
  }

  async answerCreate(user_id: string, body: CreateAnswerPayload) {
    try {
      let totalQuetion = 0
      let totalAnswer = 0

      let data: any = body
      data['user_id'] = user_id
      data['created_at'] = moment.utc().format('YYYY-DD-MM HH:mm:ss')
      data['updated_at'] = moment.utc().format('YYYY-DD-MM HH:mm:ss')

      const quizzes = await this.quizzesRepository
        .createQueryBuilder('quiz')
        .leftJoinAndSelect('quiz.quetions', 'que')
        .leftJoinAndSelect('que.options', 'op')
        .where('quiz.id = :id', {id: data.quiz_id})
        .getOne()

      if(!quizzes) throw new HttpException('Quizzes is not found.', HttpStatus.NOT_FOUND)

      quizzes.quetions.forEach((item) => {
        const correct = item.options.find((op) => op.is_correct)
        let answer: any = data.quetions.find((que) => que.quetion_id === item.id)
        answer = answer.option_id === correct.id

        if(!!answer) ++totalAnswer
      })

      totalQuetion = quizzes.quetions.length

      data['point'] = Math.round(( totalAnswer/totalQuetion) * 100)
      data['quetions'] = JSON.stringify(data.quetions)

      return await this.answersRepository.save(
        await this.answersRepository.create(data)
      )
    } catch (err) {
      throw new HttpException(err.message, err.code)
    }
  }

  async answerList(params: any, auth_user) {
    try {
      let page = params.page ? parseInt(params.page) : 1
      let limit = params.limit ? parseInt(params.limit) : 10

      let query = await this.answersRepository
        .createQueryBuilder('ans')
        .leftJoinAndSelect('ans.quiz', 'quiz')
        .leftJoinAndSelect('ans.user', 'user')
        .where('ans.deleted_at is null')

      if(auth_user.role.name !== 'admin') {
        query.andWhere('ans.user_id = :user_id', {user_id: auth_user.id})
      }

      if(!!params.keyword) {
        query.andWhere('quiz.name like :name OR user.name like :name', {name: `%${params.keyword}%`})
      }

      let count = await query.getCount();
      let pageCount = Math.ceil(count / limit)

      if (page > pageCount) {
        page = page == 1 ? page : pageCount
      }

      const offset = page == 1 ? 0 : (page - 1) * limit

      let report = await query
        .take(limit)
        .skip(offset)
        .getMany();

      const slNo = page == 1 ? 0 : (page - 1) * limit - 1

      const paginator = {
        itemCount: count,
        limit: limit,
        pageCount: pageCount,
        page: page,
        slNo: slNo + 1,
        hasPrevPage: page > 1 ? true : false,
        hasNextPage: page < pageCount ? true : false,
        prevPage: page > 1 && page != 1 ? page - 1 : null,
        nextPage: page < pageCount ? page + 1 : null,
      };

      let result = {
        answers: count > 0 ? report : [],
        paginator: paginator
      }

      return result
    } catch (err) {
      throw new HttpException(err.message, err.code)
    }
  }

  async answerDetail(id: string) {
    try {
      let result = {}
      let answer = await this.answersRepository
        .createQueryBuilder('ans')
        .leftJoinAndSelect('ans.quiz', 'quiz')
        .leftJoinAndSelect('quiz.subject', 'subs')
        .leftJoinAndSelect('quiz.quetions', 'que')
        .leftJoinAndSelect('que.options', 'op')
        .leftJoinAndSelect('ans.user', 'user')
        .getOne()

      if(!answer) throw new HttpException('Answers is not found.', HttpStatus.NOT_FOUND)

      result['quiz_name'] = `${answer.quiz.subject.name} - ${answer.quiz.name}`
      result['student_name'] = answer.user.name
      result['point'] = answer.point

      let userAnswer = JSON.parse(answer.quetions)
      userAnswer = userAnswer.map((item) => {
        const findQue = answer.quiz.quetions.find((que) => que.id === item.quetion_id)
        const ansOpt = findQue.options.find((op) => op.id === item.option_id)
        const trueOpt = findQue.options.find((op) => !!op.is_correct)

        return {
          quetion: findQue.name,
          user_answer: ansOpt.name,
          true_answer: trueOpt.name
        }
      })

      result['answers'] = userAnswer

      return result
    } catch (err) {
      throw new HttpException(err.message, err.code)
    }
  }
}