import { HttpException, HttpStatus } from '@nestjs/common';
import UserService from './user.service';
import { Request, Response, NextFunction } from 'express';
import { IUserDocument, ROLE } from './user.interface';
import ActivityService from '../activity/activity.service';
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
      const { name, country, address, iddentity } = req.body;
      const user = req.user as unknown as IUserDocument;

      await this.userService.repository.updateOne(
        { _id: user._id },
        {
          name,
          address,
          country,
          iddentity,
        },
      );
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

  //agent detail
  public findAllAgentDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const agents = await this.userService.repository.find({ role: ROLE.AGENT });
      const users = await Promise.all(
        agents.map(async agent => {
          return await this.userService.getAgentUserDetails(agent._id);
        }),
      );
      return res.status(HttpStatus.OK).send({ agents, users });
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };

  //agent user detail
  public findAllAgentUserDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const agent = req.user as unknown as IUserDocument;
      const response = await this.userService.getAgentUserDetails(agent._id);
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
      const agentOrMaster = req.user as unknown as IUserDocument;
      const response = await this.userService.repository.findOneAndUpdate({ phone, agent: agentOrMaster?._id }, { $inc: { amount: balance } });
      if (!response) throw new HttpException('you are not the agent to this customer', httpStatus.FORBIDDEN);
      await this.userService.repository.findOneAndUpdate({ _id: agentOrMaster?._id }, { $inc: { amount: -balance } });
      const user = await this.userService.findOne({ phone });
      await ActivityService.create({
        user: user._id,
        balanceChange: balance,
        message:
          balance > 0
            ? `You have successfully deposited Rs ${balance} to your account`
            : `You have successfully withdraw Rs ${balance} from your account`,
      });
      await ActivityService.create({
        user: agentOrMaster._id,
        balanceChange: -balance,
        message:
          -balance > 0
            ? `You have successfully deposited Rs ${balance} from user ${user._id}, your balance should increase, you pay out to user in cash.`
            : `You have successfully withdrawed Rs ${balance} from your account to user ${user._id}, your balance should decrease, you receive cash from user.`,
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
