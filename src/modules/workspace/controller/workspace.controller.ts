import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { WorkspaceService } from '../service/workspace.service';
import { CreateWorkspaceDto } from '../dtos/createWorkspace.dto';

@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  // @Get('available/:roomId/:sessionId')
  // getAvailableWorkspaces(
  //   @Param('roomId') roomId: number,
  //   @Param('sessionId') sessionId: number,
  // ) {
  //   return this.workspaceService.findAvailableWorkspaces(roomId, sessionId);
  // }

  // @Get('occupied/:roomId/:sessionId')
  // getOccupiedWorkspaces(
  //   @Param('roomId') roomId: number,
  //   @Param('sessionId') sessionId: number,
  // ) {
  //   return this.workspaceService.findOccupiedWorkspaces(roomId, sessionId);
  // }

  @Post()
  create(@Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspaceService.create(createWorkspaceDto);
  }

  @Get()
  findAll() {
    return this.workspaceService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: number) {
  //   return this.workspaceService.findOne(id);
  // }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.workspaceService.remove(id);
  }
}
