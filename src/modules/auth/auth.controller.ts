import { HttpStatus } from '@nestjs/common';

import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { LoginDto } from './dtos/login.dto';
import { LogoutDto } from './dtos/logout.dto';
import { RegisterDto } from './dtos/register.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { TokenDto } from './dtos/token.dto';

import AuthService from './auth.service';
import { NextFunction, Request, Response } from 'express';
import ActivityService from '../activity/activity.service';
import AgentModel from '../user/agent.modal';
import UserModel from '../user/user.modal';

export class AuthController {
  static instance: null | AuthController;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor(private authService = AuthService) {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new AuthController();
    }
    return this.instance;
  }

  // Route: POST: /v1/auth/login
  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginDto: LoginDto = req.body;
      const response = await this.authService.login(loginDto);
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };

  // Route: POST: /v1/auth/register
  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const registerUserDto: RegisterDto = req.body;
      const response = await this.authService.register(registerUserDto);

      //add user to agent if he register from agent refer code
      if (registerUserDto?.referCode) {
        const agent = await AgentModel.findOneAndUpdate(
          { referCode: registerUserDto?.referCode },
          {
            $push: { users: response.user._id },
          },
        );

        const data = await UserModel.findOneAndUpdate({ _id: response?.user?._id }, { $set: { agent: agent?._id } });
        console.log({ data });
      }
      await ActivityService.create({
        user: response.user._id,
        message: response.message,
      });
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };

  // Route: POST: /v1/auth/logout
  public logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const logoutDto: LogoutDto = req.body;
      const response = await this.authService.logout(logoutDto);
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };

  // Route: GET: /v1/auth/generate/tokens
  public generateTokens = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenDto: TokenDto = req.body;
      const response = await this.authService.generateTokens(tokenDto);
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };

  // Route: GET: /v1/auth/forgot-password
  public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const forgotPasswordDto: ForgotPasswordDto = req.body;
      const response = await this.authService.forgotPassword(forgotPasswordDto);
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };

  // Route: GET: /v1/auth/reset-password
  public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resetPasswordDto: ResetPasswordDto = req.body;
      const { token } = req.query;
      const response = await this.authService.resetPassword(resetPasswordDto, token as string);
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };
}

export default AuthController.getInstance();
