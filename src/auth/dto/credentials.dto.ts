import { IsNotEmpty } from 'class-validator';

export class CredentialsDTO {
    @IsNotEmpty()
    expiresIn: string;

    @IsNotEmpty()
    access_token: string;
}