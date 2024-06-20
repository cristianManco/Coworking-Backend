import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Room } from '../../room/entities/room.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';

@Entity()
export class Workspace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: string;

  @ManyToOne(() => Room, (room) => room.workspaces)
  room: Room;

  @OneToMany(() => Reservation, (reservation) => reservation.workspace)
  reservations: Reservation[];
}
