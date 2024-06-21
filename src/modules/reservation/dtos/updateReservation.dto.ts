import { IsInt, IsOptional } from 'class-validator';

export class UpdateReservationDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsInt()
  workspaceId?: number;

  @IsOptional()
  @IsInt()
  sessionId?: number;
}
