import { HttpStatus } from '@nestjs/common';
import UserService from './user.service';
import { Request, Response, NextFunction } from 'express';
import { IUserDocument } from './user.interface';
import AgentModel from './agent.modal';
import ActivityService from '../activity/activity.service';

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
      const { name, country, address, phone, iddentity } = req.body;

      await AgentModel.create({
        referCode: `refer-${Date.now()}`,
        name,
        address,
        country,
        phone,
        iddentity,
      });
      const user = req.user as unknown as IUserDocument;
      await ActivityService.create({
        user: user._id,
        message: 'You have applied for agent. Please wait till we review your application',
      });
      res.json({ message: 'Agent onboard successfully!' });
    } catch (err) {
      console.error('Error in logging:', err);
      return next(err);
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
  // Route: POST: /v1/user/update-balance
  public updateBalance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { balance, phone } = req.body;
      const response = await this.userService.repository.findOneAndUpdate({ phone }, { $inc: { amount: balance } });
      const user = await this.userService.findOne({ phone });
      await ActivityService.create({
        user: user._id,
        message:
          balance < 0
            ? `You have successfully withdraw Rs ${balance} from your account`
            : `You have successfully deposited Rs ${balance} from your account`,
      });
      return res.status(HttpStatus.OK).send({
        message: balance < 0 ? `Withdraw of Rs ${balance} Success` : `Deposit of Rs ${balance} Success`,
      });
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
