import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PublishResultDto {
  @IsString()
  @IsNotEmpty()
  place: string;

  @IsNumber()
  @IsNotEmpty()
  leftTicketNumber: string;

  @IsNumber()
  @IsNotEmpty()
  rightTicketNumber: string;

  @IsNumber()
  @IsNotEmpty()
  time: number;
}
