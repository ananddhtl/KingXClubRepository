import { HttpException, HttpStatus } from '@nestjs/common';
import UserService from './user.service';
import { Request, Response, NextFunction } from 'express';
import { IUserDocument } from './user.interface';
import fs from 'fs';
import AgentModel from './agent.modal';
import httpStatus from 'http-status';

export class UserController {
  static instance: null | UserController;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor(private userService = UserService) {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new UserController();
    }
    return this.instance;
  }

  // Route: GET: /v1/user/me
  public getLoggedinUserDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as unknown as IUserDocument;
      const response = await this.userService.getLoggedinUserDetails(user._id);
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };

  // Route: GET: /v1/user/me
  public onboardAgent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // if (!(req as any).file) throw new HttpException('FIle not found', httpStatus.CONFLICT);
      console.log((req as any).file);

      const iddentity = fs.readFileSync((req as any).file.path); // Read file data
      const { name, country, address, phone } = req.body;
      console.log(name, country, address, phone);

      await AgentModel.create({
        name,
        address,
        country,
        phone,
        iddentity,
      });

      res.json({ message: 'File uploaded successfully!' });
    } catch (err) {
      console.error('Error in logging:', err);
      return next(err);
    } finally {
      fs.unlinkSync((req as any).file.path);
    }
  };

  // Route: DELETE: /v1/user/me
  public deleteLoggedinUserDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as unknown as IUserDocument;
      const response = await this.userService.deleteLoggedinUserDetails(user._id);
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };

  // Route: PUT: /v1/user/:id
  public updateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const data = req.body;
      const response = await this.userService.updateById(userId, data);
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };

  // Route: GET: /v1/user/all
  public findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.userService.find({});
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };

  // Route: GET: /v1/user/:id
  public findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const response = await this.userService.findById(userId);
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };

  // Route: DELETE: /v1/user/:id
  public deleteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const response = await this.userService.deleteOne({ _id: userId });
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };
}

export default UserController.getInstance();
