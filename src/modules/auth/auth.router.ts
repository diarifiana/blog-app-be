import { Router } from "express";
import { injectable } from "tsyringe";
import { validateBody } from "../../middlewares/validation.middleware";
import { AuthController } from "./auth.controller";
import { RegisterDTO } from "./dto/register.dto";
import { LoginDTO } from "./dto/login.dto";
import { ForgotPasswordDTO } from "./dto/forgot-password.dto";
import { ResetPasswordDTO } from "./dto/reset-password.dto";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";
import { JWT_SECRET_KEY_FORGOT_PASSWORD } from "../../config";

@injectable()
export class AuthRouter {
  private router: Router;
  private authController: AuthController;
  private jwtMiddleware: JwtMiddleware;

  constructor(AuthController: AuthController, JwtMiddleware: JwtMiddleware) {
    this.router = Router();
    this.authController = AuthController;
    this.jwtMiddleware = JwtMiddleware;
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.post(
      "/register",
      validateBody(RegisterDTO),
      this.authController.register
    );

    this.router.post(
      "/login",
      validateBody(LoginDTO),
      this.authController.login
    );

    this.router.post(
      "/forgot-password",
      validateBody(ForgotPasswordDTO),
      this.authController.forgotPassword
    );

    this.router.patch(
      "/reset-password",
      this.jwtMiddleware.verifyToken(JWT_SECRET_KEY_FORGOT_PASSWORD!),
      validateBody(ResetPasswordDTO),
      this.authController.resetPassword
    );
  };

  getRouter() {
    return this.router;
  }
}
