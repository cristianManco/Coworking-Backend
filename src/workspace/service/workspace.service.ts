import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from '../entities/workpace.entity';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private workspacesRepository: Repository<Workspace>,
  ) {}

  async findAvailableWorkspaces(roomId: number, sessionId: number) {
    return this.workspacesRepository
      .createQueryBuilder('workspace')
      .leftJoinAndSelect(
        'workspace.reservations',
        'reservation',
        'reservation.sessionId = :sessionId',
        { sessionId },
      )
      .where('workspace.roomId = :roomId', { roomId })
      .andWhere('reservation.id IS NULL')
      .getMany();
  }

  async findOccupiedWorkspaces(roomId: number, sessionId: number) {
    return this.workspacesRepository
      .createQueryBuilder('workspace')
      .leftJoinAndSelect(
        'workspace.reservations',
        'reservation',
        'reservation.sessionId = :sessionId',
        { sessionId },
      )
      .where('workspace.roomId = :roomId', { roomId })
      .andWhere('reservation.id IS NOT NULL')
      .getMany();
  }
}
