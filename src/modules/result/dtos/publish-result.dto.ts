import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PublishResultDto {
  @IsString()
  @IsNotEmpty()
  place: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsString()
  @IsNotEmpty()
  ticketNumber: string;

  @IsNumber()
  @IsNotEmpty()
  time: number;
}
