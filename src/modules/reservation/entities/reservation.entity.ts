import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Workspace } from '../../workspace/entities/workpace.entity';
import { Session } from '../../session/entities/session.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reservations)
  user: User;

  @ManyToOne(() => Workspace, (workspace) => workspace.reservations)
  workspace: Workspace;

  @ManyToOne(() => Session, (session) => session.reservations)
  session: Session;
}
