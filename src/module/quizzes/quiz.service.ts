import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
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
import { Users } from 'src/schema/users.entity';
import { Roles } from 'src/schema/roles.entity';

const moment = require('moment');

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Roles)
    private rolesRepository: Repository<Roles>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
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

  async dashboard() {
    try {
      const rolesCurrent = await this.rolesRepository.createQueryBuilder('query').where('query.deleted_at is null').getCount()
      const rolesDeleted = await this.rolesRepository.createQueryBuilder('query').where('query.deleted_at is not null').getCount()
      const usersCurrent = await this.usersRepository.createQueryBuilder('query').where('query.deleted_at is null').getCount()
      const usersDeleted = await this.usersRepository.createQueryBuilder('query').where('query.deleted_at is not null').getCount()
      const subjectsCurrent = await this.subjectsRepository.createQueryBuilder('query').where('query.deleted_at is null').getCount()
      const subjectsDeleted = await this.subjectsRepository.createQueryBuilder('query').where('query.deleted_at is not null').getCount()
      const quizzesCurrent = await this.quizzesRepository.createQueryBuilder('query').where('query.deleted_at is null').getCount()
      const quizzesDeleted = await this.quizzesRepository.createQueryBuilder('query').where('query.deleted_at is not null').getCount()
      const quetionsCurrent = await this.quetionsRepository.createQueryBuilder('query').where('query.deleted_at is null').getCount()
      const quetionsDeleted = await this.quetionsRepository.createQueryBuilder('query').where('query.deleted_at is not null').getCount()
      const optionsCurrent = await this.optionsRepository.createQueryBuilder('query').where('query.deleted_at is null').getCount()
      const optionsDeleted = await this.optionsRepository.createQueryBuilder('query').where('query.deleted_at is not null').getCount()
      const answersCurrent = await this.answersRepository.createQueryBuilder('query').where('query.deleted_at is null').getCount()
      const answersDeleted = await this.answersRepository.createQueryBuilder('query').where('query.deleted_at is not null').getCount()

      const twelveMonthsAgo = moment().subtract(11, 'months').startOf('month');
      const months = [];
      let tempDate = moment(twelveMonthsAgo);
      for (let i = 0; i < 12; i++) {
          const year = tempDate.year()
          const month = tempDate.month() + 1
          months.push(`${year}-${month.toString().padStart(2, '0')}`);
          tempDate.add(1, 'month')
      }

      const answersPerMonth = await this.answersRepository.createQueryBuilder('query')
          .select("DATE_FORMAT(query.created_at, '%Y-%m') AS month")
          .addSelect("COUNT(query.id) AS total")
          .addSelect("AVG(query.point) AS average_point")
          .where('query.deleted_at IS NULL')
          .andWhere('query.created_at >= :twelveMonthsAgo', { twelveMonthsAgo: twelveMonthsAgo.format('YYYY-MM-DD HH:mm:ss') })
          .groupBy('month')
          .getRawMany()

      const answerCount = months.map(month => {
          const found = answersPerMonth.find(item => item.month === month);
          return {
              month,
              total: found ? parseInt(found.total) : 0,
              average_point: found ? parseFloat(found.average_point) : 0
          };
      });

      return {
        roles: {
          current: rolesCurrent,
          deleted: rolesDeleted,
          total: rolesCurrent + rolesDeleted
        },
        users: {
          current: usersCurrent,
          deleted: usersDeleted,
          total: usersCurrent + usersDeleted
        },
        subjects: {
          current: subjectsCurrent,
          deleted: subjectsDeleted,
          total: subjectsCurrent + subjectsDeleted
        },
        quizzes: {
          current: quizzesCurrent,
          deleted: quizzesDeleted,
          total: quizzesCurrent + quizzesDeleted
        },
        quetions: {
          current: quetionsCurrent,
          deleted: quetionsDeleted,
          total: quetionsCurrent + quetionsDeleted
        },
        options: {
          current: optionsCurrent,
          deleted: optionsDeleted,
          total: optionsCurrent + optionsDeleted
        },
        answers: {
          current: answersCurrent,
          deleted: answersDeleted,
          total: answersCurrent + answersDeleted
        },
        count: {
          answer: answerCount
        }
      }
    } catch (err) {
      throw new HttpException(err.message, err.code)
    }
  }

  async subjectCreate(body: CreateSubjectPayload) {
    let result: any

    try {
      let videos = []
      let data = body
      data['created_at'] = new Date()
      data['updated_at'] = new Date()

      if(data.videos.length > 0) videos = data.videos

      const subject = await this.subjectsRepository.save(
        this.subjectsRepository.create(data)
      )

      if(!subject) throw new HttpException('Failed create subject data', HttpStatus.BAD_REQUEST)

      if(videos.length > 0) {
        videos = videos.map((item) => {
          item['subject_id'] = subject['id']
          item['created_at'] = new Date()
          item['updated_at'] = new Date()
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
        .leftJoinAndSelect('sub.quizzes', 'quiz')
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

      if(report.length > 0) {
        for(let data of report) {
          data['total_quiz'] = data.quizzes.length
          delete data.quizzes
        }
      }

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
    let subject = await this.subjectsRepository
      .createQueryBuilder('sub')
      .leftJoinAndSelect('sub.videos', 'vid')
      .leftJoinAndSelect('sub.quizzes', 'q')
      .where('sub.id = :id', {id})
      .getOne()

      if(subject && subject.videos) {
        let videos = []
        for(let item of subject.videos) {
          if(!item.deleted_at) {
            videos.push(item)
          }
        }

        subject.videos = videos
      }

      if(subject && subject.quizzes) {
        let quizzes = []
        for(let item of subject.quizzes) {
          if(!item.deleted_at) {
            quizzes.push(item)
          }
        }

        subject.quizzes = quizzes
      }
      
      return subject
  }

  async videoDetail(id: string) {
    return await this.videosRepository
      .createQueryBuilder('video')
      .where('video.id = :id', {id})
      .getOne()
  }

  async subjectUpdate(id: string, body: UpdateSubjectPayload) {
    try {
      let videos = []
      let data = body
      data['updated_at'] = moment.utc().format('YYYY-MM-DD HH:mm:ss')

      if(!!data.videos ) {
        videos = data.videos.map((item) => {
          item['subject_id'] = id
          item['created_at'] = new Date()
          item['updated_at'] = new Date()
          return item
        })

        await this.videosRepository
          .createQueryBuilder()
          .insert()
          .into(Videos)
          .values(videos)
          .execute()

        delete data.videos
      }

      if(!!data.quizzes ) {
        for(let item of data.quizzes) {
          for(const que of item.quetions) {
            const isCorrect = que.options.filter((correct) => !!correct.is_correct).length
    
            if(isCorrect > 1) {
              throw new HttpException('Is correct option cannot be more than 1', HttpStatus.UNPROCESSABLE_ENTITY)
            }
          }

          item['subject_id'] = id
          item['created_at'] = new Date()
          item['updated_at'] = new Date()

          await this.quizzesRepository
            .createQueryBuilder()
            .insert()
            .into(Quizzes)
            .values(item)
            .execute()
            .then(async (quizResponse) => {
              for(let quetion of item.quetions) {
                quetion['quiz_id'] = quizResponse['id']
                quetion['created_at'] = new Date()
                quetion['updated_at'] = new Date()
                await this.quetionsRepository
                  .createQueryBuilder()
                  .insert()
                  .into(Quetions)
                  .values(quetion)
                  .execute()
                  .then(async (quetionResponse) => {
                    for(let option of quetion.options) {
                      option['quetion_id'] = quetionResponse['id']
                      option['created_at'] = new Date()
                      option['updated_at'] = new Date()
                      await this.optionsRepository
                        .createQueryBuilder()
                        .insert()
                        .into(Options)
                        .values(option)
                        .execute()
                    }
                  })
              }
            })
        }

        delete data.quizzes

      }

      return await this.subjectsRepository
        .createQueryBuilder()
        .update(Subjects)
        .set(data)
        .where('id = :id', {id})
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
        .where('id = :id', {id})
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
        deleted_at: new Date()
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
        deleted_at: new Date()
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
      for(const item of body.quetions) {
        const isCorrect = item.options.filter((correct) => !!correct.is_correct).length

        if(isCorrect > 1) {
          throw new HttpException('Is correct option cannot be more than 1', HttpStatus.UNPROCESSABLE_ENTITY)
        }
      }

      let quetions = []
      let data = body

      quetions = data.quetions
      delete data.quetions

      data['created_at'] = new Date()
      data['updated_at'] = new Date()

      const quiz = await this.quizzesRepository.save(
        this.quizzesRepository.create(data)
      )

      if(!quiz) throw new HttpException('Failed create quizzes data', HttpStatus.BAD_REQUEST)
      if(quetions.length > 0) {
        for(let item of quetions) {
          let options = []
          item['quiz_id'] = quiz.id
          item['created_at'] = new Date()
          item['updated_at'] = new Date()

          options = item.options
          delete item.options
          
          const quetion = await this.quetionsRepository.save(
            this.quetionsRepository.create(item)
          )

          if(!quetion) throw new HttpException('Failed create quetions data', HttpStatus.BAD_REQUEST)

          options = options.map((e) => {
            e['quetion_id'] = quetion['id']  
            e['created_at'] = new Date()
            e['updated_at'] = new Date()
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

  async quizList(params: any, subject_id: string) {
    try {
      let page = params.page ? parseInt(params.page) : 1
      let limit = params.limit ? parseInt(params.limit) : 10

      let query = await this.quizzesRepository
        .createQueryBuilder('quiz')
        .leftJoinAndSelect('quiz.quetions', 'quetion')
        .where('quiz.deleted_at is null')
        .andWhere('quiz.subject_id = :subject_id', {subject_id})
        .andWhere('quetion.deleted_at is null')

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

      if(report.length > 0) {
        for(let data of report) {
          data['total_quetions'] = data.quetions.length
          delete data.quetions
        }
      }

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
    let quiz = await this.quizzesRepository
      .createQueryBuilder('quiz')
      .leftJoinAndSelect('quiz.quetions', 'que')
      .leftJoinAndSelect('que.options', 'op')
      .where('quiz.id = :id', {id})
      .getOne()

      if(quiz && quiz.quetions.length > 0) {
        let quizQuetion = []
        for(let data of quiz.quetions) {
          let quetions
          if(!data.deleted_at) {
            quetions = {...data, options: []}
            for(let item of data.options) {
              if(!item.deleted_at) {
                quetions.options.push(item)
              }
            }
            quizQuetion.push(quetions)
          }
          quiz.quetions = quizQuetion
        }
      }

      return quiz
  }

  async quizUpdate(id: string, body: UpdateQuizzessPayload) {
    try {
      let data = body
      data['updated_at'] = moment.utc().format('YYYY-MM-DD HH:mm:ss')

      if(!!data.quetions) {
        for(let quetion of data.quetions) {
          const optionsData = quetion.options
          delete quetion.options

          quetion['updated_at'] = new Date()

          if(!!quetion.id) {
            const quetionId = quetion.id
            delete quetion.id

            await this.quetionsRepository
              .createQueryBuilder()
              .update(Quetions)
              .set(quetion)
              .where('id = :id', {id: quetionId})
              .execute()

              for(let option of optionsData) {
                option['updated_at'] = new Date()
                if(!!option.id) {
                  const optionId = option.id
                  delete option.id

                  await this.optionsRepository
                    .createQueryBuilder()
                    .update(Options)
                    .set(option)
                    .where('id = :id', {id: optionId})
                    .execute()
                } else {
                  option['quetion_id'] = quetionId
                  option['created_at'] = new Date()
                  await this.optionsRepository
                    .createQueryBuilder()
                    .insert()
                    .into(Options)
                    .values(option)
                    .execute()
                }
              }
          } else {
            quetion['quiz_id'] = id
            quetion['created_at'] = new Date()
            const quiz = await this.quetionsRepository.save(
              this.quetionsRepository.create(quetion)
            )

            for(let option of optionsData) {
              option['quetion_id'] = quiz['id']
              option['created_at'] = new Date()
              option['updated_at'] = new Date()

              await this.optionsRepository
                .createQueryBuilder()
                .insert()
                .into(Options)
                .values(option)
                .execute()
            }
          }
        }

        delete data.quetions

      }

      return await this.quizzesRepository
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
        deleted_at: new Date()
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
    let quetions = await this.quetionsRepository
      .createQueryBuilder('que')
      .leftJoinAndSelect('que.options', 'op')
      .where('que.id = :id', {id})
      .getOne()

    if(quetions && quetions.options.length > 0) {
      let options = []
      for(let item of quetions.options) {
        if(!item.deleted_at) {
          options.push(item)
        }
      }

      quetions.options = options
    }

    return quetions
  }

  async quetionUpdate(id: string, body: UpdateQuetionPayload) {
    try {
      let data = body
      data['updated_at'] = moment.utc().format('YYYY-MM-DD HH:mm:ss')

      if(!!data.options) {
        for(let item of data.options) {
          item['quetion_id'] = id
          item['created_at'] = new Date()
          item['updated_at'] = new Date()
          await this.optionsRepository
            .createQueryBuilder()
            .insert()
            .into(Options)
            .values(item)
            .execute()
        }
      }

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
        deleted_at: new Date()
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
            .where('quetion_id IN (:...id)', {id: [id]})
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
        deleted_at: new Date()
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
      data['created_at'] = new Date()
      data['updated_at'] = new Date()

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