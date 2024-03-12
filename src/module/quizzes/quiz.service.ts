import { Injectable, Logger, HttpStatus, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Subjects } from 'src/schema/subjects.entity';
import { Videos } from 'src/schema/videos.entity';
import { CreateSubjectPayload, UpdateSubjectPayload, UpdateVideoPayload } from 'src/interface/quiz.interface';

const moment = require('moment');

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Subjects)
    private subjectsRepository: Repository<Subjects>,
    @InjectRepository(Videos)
    private videosRepository: Repository<Videos>,
  ) {}

  async subjectCreate(body: CreateSubjectPayload) {
    let result: any

    try {
      let videos = []
      let data = body
      data['created_at'] = moment.utc().format('YYYY-DD-MM HH:mm:ss')
      data['updated_at'] = moment.utc().format('YYYY-DD-MM HH:mm:ss')

      if(data.videos.length > 0) {
        data.videos['created_at'] = moment.utc().format('YYYY-DD-MM HH:mm:ss')
        data.videos['updated_at'] = moment.utc().format('YYYY-DD-MM HH:mm:ss')
        videos = data.videos
      }

      const subject = await this.subjectsRepository.save(
        this.subjectsRepository.create(data)
      )

      if(!subject) throw new HttpException('Failed create subject data', HttpStatus.BAD_REQUEST)

      if(videos.length > 0) {
        videos = videos.map((item) => {
          item['subject_id'] = subject['id']
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
      .createQueryBuilder('subject')
      .leftJoinAndSelect('subject.videos', 'vid')
      .where('subject.id = :id', {id})
      .andWhere('vid.deleted_at is null')
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

  async subjectDelete(id: string) {    try {
      const data = {
        deleted_at: moment.utc().format('YYYY-DD-MM HH:mm:ss')
      }

      const subject = await this.subjectsRepository
        .createQueryBuilder('subject')
        .leftJoinAndSelect('subject.videos', 'video')
        .where('subject.id = :id', {id})
        .getOne()

      if(!subject) throw new HttpException('Subject is not found.', HttpStatus.NOT_FOUND)

      let videoIds: string[] = []
      if(subject.videos.length > 0) {
        videoIds = subject.videos.map((e) => {return e.id})
      }

      await this.subjectsRepository
        .createQueryBuilder()
        .update(Subjects)
        .set(data)
        .where('id = :id', {id})
        .execute()
        .then(async (res) => {
          await this.videosRepository
            .createQueryBuilder()
            .update(Videos)
            .set(data)
            .where('id IN (:...id)', {id: videoIds})
            .execute()

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
}