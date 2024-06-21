import { Controller, Get, Param, Delete } from '@nestjs/common';
import { ReservationService } from '../service/reservation.service';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  findAll() {
    return this.reservationService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.reservationService.remove(id);
  }
}
