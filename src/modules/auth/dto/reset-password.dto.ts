import { IsNotEmpty, IsStrongPassword } from "class-validator";

export class ResetPasswordDTO {
  @IsNotEmpty()
  @IsStrongPassword()
  readonly password!: string;
}
