import { IsInt } from 'class-validator';

export class CreateReservationDto {
  @IsInt()
  userId: number;

  @IsInt()
  workspaceId: number;

  @IsInt()
  sessionId: number;
}
