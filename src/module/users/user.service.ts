import { Injectable, Logger, HttpStatus, HttpException } from '@nestjs/common';
import { Repository, getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/schema/users.entity';
import * as bcrypt from 'bcrypt'
import { CreateUserPayload, UpdateUserPayload } from 'src/interface/user.interface';

const moment = require('moment');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>
  ) { }

  async check(username: string) {
    return await this.usersRepository
      .createQueryBuilder('user')
      .where('user.username = :username', {username})
      .andWhere('user.deleted_at is null')
      .getOne()
  }

  async create(body: CreateUserPayload) {
    try {
      let data = body
      data['created_at'] = moment.utc().format('YYYY-DD-MM HH:mm:ss')
      data['updated_at'] = moment.utc().format('YYYY-DD-MM HH:mm:ss')

      const result = await this.usersRepository.create(data)
      await this.usersRepository.save(result)

      return result 
    } catch (err) {
      throw new HttpException(err.message, err.code);
    }
  }

  async login(username: string, password: string): Promise<any> {
    let result = {
      status: 500,
      message: '',
      data : null
    };

    try {
      let user = await this.usersRepository.createQueryBuilder('usr')
        .leftJoinAndSelect('usr.role', 'role')
        .where('usr.username = :username', {username})
        .getOne()

      if(user) {
        if (password) {
          const match = await bcrypt.compare(password, user.password)
          if(match) result = {status: HttpStatus.OK, message: 'Success', data : user}
        } else {
          result = {status: HttpStatus.OK, message: 'Success', data : user}
        }
      }

      return result
    } catch (err) {
      throw new HttpException(err.message, err.code)
    }
  }

  async list(params: any) {
    try {
      let page = params.page ? parseInt(params.page) : 1
      let limit = params.limit ? parseInt(params.limit) : 10

      let query = await this.usersRepository
        .createQueryBuilder('usr')
        .leftJoinAndSelect('usr.role', 'role')
        .where('usr.deleted_at is null')

      if(!!params.keyword){
        query.andWhere('usr.name like :name OR role.name like :role', {
          name: `%${params.keyword}%`,
          role: `%${params.keyword}%`
        })
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
        users: count > 0 ? report : [],
        paginator: paginator
      }

      return result
    } catch (err) {
      throw new HttpException(err.message, err.code)
    }
  }

  async detail(id: string) {
    return await this.usersRepository
      .createQueryBuilder('usr')
      .leftJoinAndSelect('usr.role', 'role')
      .where('usr.id = :id', {id})
      .getOne()
  }

  async update(id: string, body: UpdateUserPayload) {
    try {
      let data = body
      data['updated_at'] = moment.utc().format('YYYY-DD-MM HH:mm:ss')

      return await this.usersRepository
        .createQueryBuilder()
        .update(Users)
        .set(data)
        .where('id = :id', {id})
        .execute()
        .then(async (res) => {
          if(res.affected < 1) throw new HttpException('Failed to update data', HttpStatus.INTERNAL_SERVER_ERROR)
          return await this.usersRepository
            .createQueryBuilder('usr')
            .leftJoinAndSelect('usr.role', 'role')
            .where('usr.id = :id', {id})
            .getOne()
        })
    } catch (err) {
      throw new HttpException(err.message, err.code)
    }
  }

  async delete(id: string) {
    try {
      const data = {
        deleted_at: moment.utc().format('YYYY-DD-MM HH:mm:ss')
      }

      return await this.usersRepository
        .createQueryBuilder()
        .update(Users)
        .set(data)
        .where('id = :id', {id})
        .execute()

    } catch (err) {
      throw new HttpException(err.message, err.code)
    }
  }
}