import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgotPasswordDTO {
  @IsNotEmpty()
  @IsEmail()
  readonly email!: string;
}
