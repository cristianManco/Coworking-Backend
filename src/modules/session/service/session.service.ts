import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../entities/session.entity';
import { CreateSessionDto } from '../dtos/createSession.dto';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
  ) {}

  async findMostOccupiedSessions() {
    return this.sessionsRepository
      .createQueryBuilder('session')
      .leftJoin('session.reservations', 'reservation')
      .groupBy('session.id')
      .orderBy('COUNT(reservation.id)', 'DESC')
      .getMany();
  }

  async findMostAvailableSessions() {
    return this.sessionsRepository
      .createQueryBuilder('session')
      .leftJoin('session.reservations', 'reservation')
      .groupBy('session.id')
      .orderBy('COUNT(reservation.id)', 'ASC')
      .getMany();
  }

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    const session = this.sessionsRepository.create(createSessionDto);
    return this.sessionsRepository.save(session);
  }

  async findAll(): Promise<Session[]> {
    return this.sessionsRepository.find();
  }

  // async findOne(id: number): Promise<Session> {
  //   return this.sessionsRepository.findOne(id);
  // }

  async remove(id: number): Promise<void> {
    await this.sessionsRepository.delete(id);
  }

  async findMostOccupied(): Promise<Session[]> {
    // Custom query to find the most occupied sessions
    return this.sessionsRepository.query(`
      SELECT * FROM session
      ORDER BY (SELECT COUNT(*) FROM reservation WHERE reservation.sessionId = session.id) DESC
    `);
  }

  async findMostAvailable(): Promise<Session[]> {
    // Custom query to find the most available sessions
    return this.sessionsRepository.query(`
      SELECT * FROM session
      ORDER BY (SELECT COUNT(*) FROM reservation WHERE reservation.sessionId = session.id) ASC
    `);
  }
}
