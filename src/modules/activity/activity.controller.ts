import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '@nestjs/common';
import ActivityService from './activity.service';
import { IUserDocument } from '../user/user.interface';

export class ActivityController {
  static instance: null | ActivityController;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor(private activityService = ActivityService) {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new ActivityController();
    }
    return this.instance;
  }

  // Route: GET: /v1/category/all
  public findMyActivity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as unknown as IUserDocument;
      const response = await this.activityService.repository.find({ user: user._id }).sort({ createdAt: -1 }).limit(100);
      return res.status(HttpStatus.OK).send({ data: response, message: 'User Activities' });
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };

  // Route: GET: /v1/activity/all
  public findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.activityService.find({});
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };

  // Route: GET: /v1/activity/:id
  public findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const response = await this.activityService.findById(id);
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };

  // Route: PUT: /v1/activity/:id
  public updateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const response = await this.activityService.updateById(id, data);
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };

  // Route: DELETE: /v1/activity/:id
  public deleteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const response = await this.activityService.deleteOne({ _id: id });
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };
}

export default ActivityController.getInstance();