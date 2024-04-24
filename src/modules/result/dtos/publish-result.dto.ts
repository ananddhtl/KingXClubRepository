import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PublishResultDto {
  @IsString()
  @IsNotEmpty()
  place: string;

  @IsNumber()
  @IsOptional()
  result: number;

  @IsNumber()
  @IsNotEmpty()
  time: number;
}
