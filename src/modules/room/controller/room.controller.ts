import { Controller, Get, Param, Delete } from '@nestjs/common';
import { RoomService } from '../service/room.service';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  findAll() {
    return this.roomService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.roomService.remove(id);
  }
}
