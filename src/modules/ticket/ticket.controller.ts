import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '@nestjs/common';
import TicketService from './ticket.service';
import { BuyTicketDto } from './dtos/buy-ticket.dto';
import { IUserDocument } from '../user/user.interface';

export class TicketController {
  static instance: null | TicketController;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor(private ticketService = TicketService) {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new TicketController();
    }
    return this.instance;
  }

  // Route: POST: /v1/category/create
  public buyTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { place, digit, amount, time, ticket }: BuyTicketDto = req.body;
      const user = req.user as unknown as IUserDocument;
      let percentage;
      if (digit === 3) {
        percentage = 999;
      } else if (digit === 2) {
        percentage = 99;
      } else if (digit === 1) {
        percentage = 9;
      }

      const response = await this.ticketService.buyTicket({
        ticket,
        place,
        digit,
        time: new Date(time),
        amount,
        returns: amount * percentage,
        user: user._id,
      });
      return res.status(HttpStatus.OK).send({ ...response.toObject(), message: 'Ticket purchased successfully' });
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };

  public getTodayTicketDetails = async (req: Request, res: Response, next: NextFunction) => {
    const today = new Date();

    const pipeline = [
      {
        $match: {
          time: {
            $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
            $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
          },
        },
      },
      {
        $group: {
          _id: '$place', // Group by place field
          count: { $count: {} }, // Count of documents for this place today
          totalAmount: { $sum: '$amount' }, // Total amount for this place today
        },
      },
    ];

    const response = await this.ticketService.repository.aggregate(pipeline);

    return res.status(HttpStatus.OK).send(response);
  };

  public getTodayPurchasedTicket = async (req: Request, res: Response, next: NextFunction) => {
    const today = new Date();

    const pipeline = [
      {
        $match: {
          time: {
            $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
            $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
          },
        },
      },
    ];

    const response = await this.ticketService.repository.aggregate(pipeline);

    return res.status(HttpStatus.OK).send(response);
  };

  public getLuckyWinners = async (req: Request, res: Response, next: NextFunction) => {
    const today = new Date();
    const pipeline = [
      {
        $match: {
          time: {
            $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
            $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
          },
          won: true, // Filter for documents where 'won' is true
        },
      },
      {
        $lookup: {
          from: 'users', // Replace with your actual user collection name
          localField: 'user', // Field in the ticket document referencing the user
          foreignField: '_id', // Field in the user document with unique identifiers
          as: 'user', // Alias for the joined user data
        },
      },
      {
        $unwind: '$user', // Unwind the 'user' array if it contains multiple documents
      },
      {
        $sort: { amount: -1 }, // Sort by 'amount' in descending order
      },
      {
        $limit: 10, // Limit the results to 10 documents
      },
    ];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const result = await this.ticketService.repository.aggregate(pipeline);
    const response = result.map(data => {
      data.name = data.user.email.split('@')[0];
      delete data.user;
      return data;
    });
    return res.status(HttpStatus.OK).send(response);
  };

  // Route: GET: /v1/category/all
  public findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.ticketService.find({});
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };

  // Route: GET: /v1/category/:id
  public findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const response = await this.ticketService.findById(id);
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };

  // Route: PUT: /v1/category/:id
  public updateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const response = await this.ticketService.updateById(id, data);
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };

  // Route: DELETE: /v1/category/:id
  public deleteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const response = await this.ticketService.deleteOne({ _id: id });
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };
}

export default TicketController.getInstance();
