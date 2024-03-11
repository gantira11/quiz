import { Injectable, Logger, HttpStatus, HttpException } from '@nestjs/common';
import { Repository, getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from 'src/schema/roles.entity';
import { RolePayload } from 'src/interface/role.interface';

const moment = require('moment');

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Roles)
    private rolesRepository: Repository<Roles>
  ) { }

  async create(body: RolePayload) {
    try {
      let data = body
      data['created_at'] = moment.utc().format('YYYY-DD-MM HH:mm:ss')
      data['updated_at'] = moment.utc().format('YYYY-DD-MM HH:mm:ss')

      const result = await this.rolesRepository.create(data)
      await this.rolesRepository.save(result)

      return result 
    } catch (err) {
      throw new HttpException(err.message, err.code);
    }
  }

  async list(params: any) {
    try {
      let page = params.page ? parseInt(params.page) : 1
      let limit = params.limit ? parseInt(params.limit) : 10

      let query = await this.rolesRepository
        .createQueryBuilder('role')
        .where('role.deleted_at is null')

      if(!!params.keyword) {
        query.andWhere('role.name like :name', {name: `%${params.keyword}%`})
      }

      console.log('query', query.getQuery())

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
        roles: count > 0 ? report : [],
        paginator: paginator
      }

      return result
    } catch (error) {
      
    }
  }

  async detail(id: string) {
    return await this.rolesRepository
      .createQueryBuilder('role')
      .where('role.id = :id', {id})
      .getOne()
  }

  async update(id: string, body: RolePayload) {
    try {
      let data = body
      data['updated_at'] = moment.utc().format('YYYY-MM-DD HH:mm:ss')

      return await this.rolesRepository
        .createQueryBuilder()
        .update(Roles)
        .set(data)
        .where('id = :id', {id})
        .execute()
    } catch (err) {
      throw new HttpException(err.message, err.code)
    }
  }

  async delete(id: string) {
    try {
      const data = {
        deleted_at: moment.utc().format('YYYY-DD-MM HH:mm:ss')
      }

      return await this.rolesRepository
        .createQueryBuilder()
        .update(Roles)
        .set(data)
        .where('id = :id', {id})
        .execute()

    } catch (err) {
      throw new HttpException(err.message, err.code)
    }
  }
}