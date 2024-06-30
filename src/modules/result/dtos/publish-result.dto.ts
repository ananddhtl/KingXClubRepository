import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PublishResultDto {
  @IsString()
  @IsNotEmpty()
  place: string;

  @IsString()
  @IsNotEmpty()
  leftTicketNumber: string;

  @IsString()
  @IsNotEmpty()
  rightTicketNumber: string;

  @IsNumber()
  @IsNotEmpty()
  time: number;
}
