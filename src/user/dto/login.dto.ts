import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class LoginDTO {
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
