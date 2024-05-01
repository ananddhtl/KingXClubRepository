import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PublishResultDto {
  @IsString()
  @IsNotEmpty()
  place: string;

  @IsNumber()
  @IsNotEmpty()
  leftTicketNumber: number;

  @IsNumber()
  @IsNotEmpty()
  rightTicketNumber: number;

  @IsNumber()
  @IsNotEmpty()
  time: number;
}
