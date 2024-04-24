import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class BuyTicketDto {
  @IsString()
  @IsNotEmpty()
  place: string;

  @IsNumber()
  @IsOptional()
  digit: number;

  @IsNumber()
  @IsNotEmpty()
  ticket: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  time: number;
}