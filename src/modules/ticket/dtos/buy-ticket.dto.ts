import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class BuyTicketDto {
  @IsString()
  @IsNotEmpty()
  place: string;

  @IsString()
  @IsOptional()
  ticket: string;

  @IsString()
  @IsNotEmpty()
  ticketNumber: string;

  @IsString()
  @IsNotEmpty()
  betAmount: string;

  @IsString()
  @IsNotEmpty()
  betDate: string;
}
