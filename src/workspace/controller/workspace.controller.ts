import { Controller, Get, Param } from '@nestjs/common';
import { WorkspaceService } from '../service/workspace.service';

@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get('available/:roomId/:sessionId')
  getAvailableWorkspaces(
    @Param('roomId') roomId: number,
    @Param('sessionId') sessionId: number,
  ) {
    return this.workspaceService.findAvailableWorkspaces(roomId, sessionId);
  }

  @Get('occupied/:roomId/:sessionId')
  getOccupiedWorkspaces(
    @Param('roomId') roomId: number,
    @Param('sessionId') sessionId: number,
  ) {
    return this.workspaceService.findOccupiedWorkspaces(roomId, sessionId);
  }
}
