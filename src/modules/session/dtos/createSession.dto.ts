import { IsDateString } from 'class-validator';

export class CreateSessionDto {
  @IsDateString()
  startTime: Date;

  @IsDateString()
  endTime: Date;
}
