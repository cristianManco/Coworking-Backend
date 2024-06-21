import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from '../entities/workpace.entity';
import { CreateWorkspaceDto } from '../dtos/createWorkspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
  ) {}

  async create(createWorkspaceDto: CreateWorkspaceDto): Promise<Workspace> {
    const workspace = this.workspaceRepository.create(createWorkspaceDto);
    return this.workspaceRepository.save(workspace);
  }

  async findAll(): Promise<Workspace[]> {
    return this.workspaceRepository.find();
  }

  // async findOne(id: number): Promise<Workspace> {
  //   return this.workspaceRepository.findOne(id);
  // }

  // async update(
  //   id: number,
  //   updateWorkspaceDto: UpdateWorkspaceDto,
  // ): Promise<void> {
  //   await this.workspaceRepository.update(id, updateWorkspaceDto);
  // }

  async remove(id: number): Promise<void> {
    await this.workspaceRepository.delete(id);
  }

  async findAvailableByRoomAndSession(
    roomId: number,
    sessionId: number,
  ): Promise<Workspace[]> {
    // Custom query to find available workspaces
    return this.workspaceRepository.query(
      `
      SELECT * FROM workspace
      WHERE roomId = $1 AND id NOT IN (
        SELECT workspaceId FROM reservation WHERE sessionId = $2
      )
    `,
      [roomId, sessionId],
    );
  }

  async findOccupiedByRoomAndSession(
    roomId: number,
    sessionId: number,
  ): Promise<Workspace[]> {
    // Custom query to find occupied workspaces
    return this.workspaceRepository.query(
      `
      SELECT * FROM workspace
      WHERE roomId = $1 AND id IN (
        SELECT workspaceId FROM reservation WHERE sessionId = $2
      )
    `,
      [roomId, sessionId],
    );
  }

  async findByUser(userId: number): Promise<Workspace[]> {
    // Custom query to find workspaces by user
    return this.workspaceRepository.query(
      `
      SELECT * FROM workspace
      WHERE id IN (
        SELECT workspaceId FROM reservation WHERE userId = $1
      )
    `,
      [userId],
    );
  }

  async findBySession(sessionId: number): Promise<Workspace[]> {
    // Custom query to find workspaces by session
    return this.workspaceRepository.query(
      `
      SELECT * FROM workspace
      WHERE id IN (
        SELECT workspaceId FROM reservation WHERE sessionId = $1
      )
    `,
      [sessionId],
    );
  }
}
