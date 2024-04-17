import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ROLE } from '../user.interface';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ROLE)
  role: ROLE;

  @IsString()
  @IsOptional()
  phone: string;

  address: {
    street: string;
    city: string;
    zip: number;
  };
}
