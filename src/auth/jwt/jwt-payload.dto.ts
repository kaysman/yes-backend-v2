import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class JwtPayload {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;

}