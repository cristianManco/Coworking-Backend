import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/createUser.dto';
import { updateUserDto } from '../dtos/updateUser.dto';
import { UserPaginationDto } from '../dtos/userPaginate.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(query: UserPaginationDto): Promise<[User[], number]> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'id',
      sortOrder = 'ASC',
    } = query;
    const where = search ? { name: Like(`%${search}%`) } : {};
    const [result, total] = await this.userRepository.findAndCount({
      where,
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });
    return [result, total];
  }

  async update(id: number, updateUserDto: updateUserDto): Promise<void> {
    await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
