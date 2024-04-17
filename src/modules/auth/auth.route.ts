import { Router } from 'express';
import AuthController from './auth.controller';
import { AppConfig } from '@/config';
import validationMiddleware from '@/middlewares/validation.middleware';
import { LoginDto } from './dtos/login.dto';
import { Routes } from '@/interfaces/routes.interface';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { LogoutDto } from './dtos/logout.dto';
import { RegisterDto } from './dtos/register.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { TokenDto } from './dtos/token.dto';
import passport from 'passport';
import authMiddleware from '@/middlewares/auth.middleware';

class AuthRoute implements Routes {
  public path = `/${AppConfig.versioning}/auth`;
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    //authenticate the user using google
    this.router.get(
      '/google/redirect',
      passport.authenticate('google', {
        successRedirect: AppConfig.client_url,
        failureRedirect: `${AppConfig.client_url}/login/failed`,
      }),
    );
    this.router.get(`${this.path}/google`, AuthController.googleAuth);
    this.router.post(`${this.path}/login`, [validationMiddleware(LoginDto, 'body')], AuthController.login);
    this.router.post(`${this.path}/register`, [validationMiddleware(RegisterDto, 'body')], AuthController.register);
    this.router.post(`${this.path}/logout`, [validationMiddleware(LogoutDto, 'body'), authMiddleware], AuthController.logout);
    this.router.post(`${this.path}/generate/token`, [validationMiddleware(TokenDto, 'body'), authMiddleware], AuthController.generateTokens);
    this.router.post(`${this.path}/forgot-password`, [validationMiddleware(ForgotPasswordDto, 'body')], AuthController.forgotPassword);
    this.router.post(`${this.path}/reset-password`, [validationMiddleware(ResetPasswordDto, 'body')], AuthController.resetPassword);
  }
}

export default AuthRoute;
