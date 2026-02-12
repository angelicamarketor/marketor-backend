import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsUrl,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { UserStateEnum } from '../constants/user-state.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  avatar?: string;

  @IsOptional()
  @IsDateString()
  lastLogin?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  idCognito?: string;

  @IsOptional()
  @IsEnum(UserStateEnum)
  state?: UserStateEnum;
}
