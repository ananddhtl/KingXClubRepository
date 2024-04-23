import { Request, Response, NextFunction } from 'express';
import { Controller, HttpStatus } from '@nestjs/common';
import TicketService from './ticket.service';
import { BuyTicketDto } from './dtos/buy-ticket.dto';
import { IUserDocument } from '../user/user.interface';

@Controller('ticket')
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
      const { place, ticketNumber, betAmount, betDate, ticket }: BuyTicketDto = req.body;
      const user = req.user as unknown as IUserDocument;
      let returns;
      if (Number(ticket) === 3) {
        returns = 1000;
      } else if (Number(ticket) === 2) {
        returns = 100;
      } else if (Number(ticket) === 1) {
        returns = 10;
      }
      console.log({ place });

      const response = await this.ticketService.buyTicket({
        ticket: Number(ticketNumber),
        place,
        time: new Date(Number(betDate)),
        amount: Number(betAmount),
        returns: Number(betAmount) * returns,
        user: user._id,
      });
      return res.status(HttpStatus.OK).send(response);
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

  // Route: POST: /v1/category/create
  public publishResult = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { timestamp, place, result } = req.body;
      const response = await this.ticketService.publishResult(timestamp, place, result);
      //@TODO : Update user balance

      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };

  // Route: GET: /v1/category/all
  public getResults = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { timestamp, place, result } = req.body;
      const response = await this.ticketService.find({});
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
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
