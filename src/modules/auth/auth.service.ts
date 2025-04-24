import { injectable } from "tsyringe";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDTO } from "./dto/register.dto";
import { ApiError } from "../../utils/api-error";
import { PasswordService } from "./password.service";
import { LoginDTO } from "./dto/login.dto";
import { TokenService } from "./token.service";
import {
  BASE_URL_FE,
  JWT_SECRET_KEY,
  JWT_SECRET_KEY_FORGOT_PASSWORD,
} from "../../config";
import { ForgotPasswordDTO } from "./dto/forgot-password.dto";
import { MailService } from "../mail/mail.service";
import { ResetPasswordDTO } from "./dto/reset-password.dto";

@injectable()
export class AuthService {
  private prisma: PrismaService;
  private passwordService: PasswordService;
  private tokenService: TokenService;
  private mailService: MailService;

  constructor(
    PrismaClient: PrismaService,
    PasswordService: PasswordService,
    TokenService: TokenService,
    MailService: MailService
  ) {
    this.prisma = PrismaClient;
    this.passwordService = PasswordService;
    this.tokenService = TokenService;
    this.mailService = MailService;
  }

  register = async (body: RegisterDTO) => {
    const { name, email, password } = body;

    const existingUser = await this.prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError("Email already exist", 400);
    }

    const hashedPassword = await this.passwordService.hashPassword(password);

    return await this.prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
      },
      omit: { password: true },
    });
  };

  login = async (body: LoginDTO) => {
    const { email, password } = body;

    const existingUser = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!existingUser) {
      throw new ApiError("Invalid credentials", 400);
    }

    const isPasswordValid = await this.passwordService.comparePassword(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      throw new ApiError("Invalid credentials", 400);
    }

    const accessToken = this.tokenService.generateToken(
      { id: existingUser.id },
      JWT_SECRET_KEY!,
      { expiresIn: "2h" }
    );

    const { password: pw, ...userWithoutPassword } = existingUser;

    return { ...userWithoutPassword, accessToken };
  };

  forgotPassword = async (body: ForgotPasswordDTO) => {
    const { email } = body;

    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new ApiError("Invalid email address", 400);
    }

    const token = this.tokenService.generateToken(
      { id: user.id },
      JWT_SECRET_KEY_FORGOT_PASSWORD!,
      { expiresIn: "1h" }
    );

    const link = `${BASE_URL_FE}/reset-password/${token}`;

    await this.mailService.sendEmail(
      email,
      "Link reset password",
      "forgot-password",
      { name: user.name, resetLink: link, expiryTime: 1 }
    );

    return { message: "Send email succsess" };
  };

  resetPassword = async (body: ResetPasswordDTO, authUserId: number) => {
    const user = await this.prisma.user.findFirst({
      where: { id: authUserId },
    });

    if (!user) {
      throw new ApiError("User not found", 400);
    }

    const hashedPassword = await this.passwordService.hashPassword(
      body.password
    );

    await this.prisma.user.update({
      where: { id: authUserId },
      data: { password: hashedPassword },
    });

    return { message: "Reset password success" };
  };
}
