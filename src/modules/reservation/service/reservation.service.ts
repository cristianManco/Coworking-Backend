import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../entities/reservation.entity';
// import { CreateReservationDto } from '../dtos/createReservation.dto';
// import { UpdateReservationDto } from '../dtos/updateReservation.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {}

  //   async create(
  //     createReservationDto: CreateReservationDto,
  //   ): Promise<Reservation> {
  //     const reservation = this.reservationRepository.create(createReservationDto);
  //     return await this.reservationRepository.save(reservation);
  //   }

  async findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find();
  }

  //   async update(
  //     id: number,
  //     updateReservationDto: UpdateReservationDto,
  //   ): Promise<void> {
  //     await this.reservationRepository.update(id, updateReservationDto);
  //   }

  async remove(id: number): Promise<void> {
    await this.reservationRepository.delete(id);
  }
}
