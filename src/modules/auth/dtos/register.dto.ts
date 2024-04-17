import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ROLE } from '../../user/user.interface';

export class RegisterDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  @IsEnum(ROLE)
  role: ROLE;

  @IsString()
  @IsOptional()
  phone: string;
}
