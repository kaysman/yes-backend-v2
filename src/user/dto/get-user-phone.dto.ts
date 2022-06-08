import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class GetUserByPhoneNumberDTO {
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}
