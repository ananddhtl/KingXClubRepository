import { HttpException, Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import ResultModel from './result.modal';
import { IResultDocument } from './result.interface';
import TicketService from '../ticket/ticket.service';
import httpStatus from 'http-status';
import UserService from '../user/user.service';

@Injectable()
export class ResultService extends BaseService<IResultDocument> {
  static instance: null | ResultService;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor(repository = ResultModel) {
    super(repository);
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ResultService();
    }
    return this.instance;
  }

  async publishResult(time: number, place: string, result: number) {
    const hasAlreadyPublished = await this.repository.findOne({ time, place });
    console.log(hasAlreadyPublished);

    if (hasAlreadyPublished) throw new HttpException('result already released', httpStatus.CONFLICT);

    const ticketPurchasePipeline = [
      {
        $match: {
          time: new Date(time),
          place,
        },
      },
      {
        $group: {
          _id: null,
          ticketCount: { $count: {} }, // Count of documents for this place today
          totalCollectedAmount: { $sum: '$amount' }, // Total amount for this place today
        },
      },
    ];
    const ticketWonPipeline = [
      {
        $match: {
          time: new Date(time), // Assuming time is in milliseconds since epoch
          place,
          ticket: result,
        },
      },
      {
        $group: {
          _id: null,
          winnerCount: { $count: {} }, // Count of documents for this place today
          totalDistributedAmount: { $sum: '$returns' }, // Total amount for this place today
        },
      },
    ];
    const purchaseDetails = await TicketService.repository.aggregate(ticketPurchasePipeline);
    const winnerDetails = await TicketService.repository.aggregate(ticketWonPipeline);

    await this.create({
      time,
      place,
      result,
      winnerCount: winnerDetails[0]?.winnerCount || 0,
      totalDistributedAmount: winnerDetails[0]?.totalDistributedAmount || 0,
      ticketCount: purchaseDetails[0]?.ticketCount || 0,
      totalCollectedAmount: purchaseDetails[0]?.totalCollectedAmount || 0,
    });
    const wonTickets = await TicketService.repository.find({ time: new Date(time), place, ticket: { $eq: result } });
    console.log({ wonTickets });

    await TicketService.repository.updateMany(
      { time: new Date(time), place, ticket: { $eq: result } },
      { $set: { won: true, result: result } },
      { new: true },
    );

    // Add User amount for winners
    await Promise.all(
      wonTickets.map(async ({ user, returns }) => {
        return await UserService.updateOne({ _id: user }, { $inc: { amount: returns } });
      }),
    );

    return {
      type: 'success',
      statusCode: 200,
      message: 'Ticket number released',
      time,
      place,
      result,
    };
  }
}

export default ResultService.getInstance();
