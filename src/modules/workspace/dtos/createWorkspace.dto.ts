import { IsString, IsInt } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  number: string;

  @IsInt()
  roomId: number;
}
