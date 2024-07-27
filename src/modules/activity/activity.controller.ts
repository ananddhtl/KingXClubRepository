import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '@nestjs/common';
import ActivityService from './activity.service';
import { IUserDocument, ROLE } from '../user/user.interface';
import { Types } from 'mongoose';

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

  // Route: GET: /v1/activity/all
  public findMyActivity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as unknown as IUserDocument;
      const response = await this.activityService.repository.find({ user: user._id }).sort({ createdAt: -1 }).limit(100);
      let transactionCount = 0;
      let transactionAmount = 0;
      if (user.role !== ROLE.USER) {
        const transactionPipeline = [
          {
            $match: {
              balanceChange: { $ne: 0 },
              user: new Types.ObjectId(user._id), // Ensure this is a valid ObjectId
            },
          },
          {
            $group: {
              _id: null, // Grouping all documents together
              transactionCount: { $sum: 1 }, // Count transactions
              totalBalanceAmount: { $sum: '$balanceChange' }, // Sum balanceChange
            },
          },
        ];

        const purchaseDetails = await this.activityService.repository.aggregate(transactionPipeline);
        transactionCount = purchaseDetails[0]?.transactionCount;
        transactionAmount = purchaseDetails[0]?.totalBalanceAmount;
      }

      return res.status(HttpStatus.OK).send({
        data: {
          history: response,
          transactionCount,
          transactionAmount,
        },
        message: 'User Activities',
      });
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
      const response = await this.activityService.repository.find({ user: id }).sort({ createdAt: -1 }).limit(100);
      const transactionPipeline = [
        {
          $match: {
            balanceChange: { $ne: 0 },
            user: new Types.ObjectId(id), // Ensure this is a valid ObjectId
          },
        },
        {
          $group: {
            _id: null, // Grouping all documents together
            transactionCount: { $sum: 1 }, // Count transactions
            totalBalanceAmount: { $sum: '$balanceChange' }, // Sum balanceChange
          },
        },
      ];

      const purchaseDetails = await this.activityService.repository.aggregate(transactionPipeline);
      return res.status(HttpStatus.OK).send({
        data: {
          history: response,
          transactionCount: purchaseDetails[0]?.transactionCount || 0,
          transactionAmount: purchaseDetails[0]?.totalBalanceAmount || 0,
        },
        message: 'User Activities',
      });
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
