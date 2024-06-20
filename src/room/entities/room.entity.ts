import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Workspace } from '../../workspace/entities/workpace.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Workspace, (workspace) => workspace.room)
  workspaces: Workspace[];
}
