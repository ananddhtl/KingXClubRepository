import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class BuyTicketDto {
  @IsString()
  @IsNotEmpty()
  place: string;

  @IsArray()
  @IsNotEmpty()
  tickets: {
    ticket: number;
    amount: number;
    time: number;
    position?: string;
  }[];
}
