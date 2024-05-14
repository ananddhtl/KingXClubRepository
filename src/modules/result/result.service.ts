import { HttpException } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import ResultModel from './result.modal';
import { IResultDocument } from './result.interface';
import TicketService from '../ticket/ticket.service';
import httpStatus from 'http-status';
import UserService from '../user/user.service';
import ActivityService from '../activity/activity.service';

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

  sumOfDigits(number) {
    return String(number)
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit), 0);
  }

  async publishResult(time: number, place: string, leftTicketNumber: number, rightTicketNumber: number) {
    const hasAlreadyPublished = await this.repository.findOne({ time, place });

    if (hasAlreadyPublished) throw new HttpException('result already released', httpStatus.CONFLICT);
    const resultDate = new Date(time);

    const ticketPurchasePipeline = [
      {
        $match: {
          time: {
            $gte: new Date(resultDate.getFullYear(), resultDate.getMonth(), resultDate.getDate(), resultDate.getHours(), resultDate.getMinutes() - 5),
            $lt: new Date(resultDate.getFullYear(), resultDate.getMonth(), resultDate.getDate(), resultDate.getHours(), resultDate.getMinutes() + 5),
          },
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
    const ticketWonPipelineLeft = [
      {
        $match: {
          time: {
            $gte: new Date(resultDate.getFullYear(), resultDate.getMonth(), resultDate.getDate(), resultDate.getHours(), resultDate.getMinutes() - 5),
            $lt: new Date(resultDate.getFullYear(), resultDate.getMonth(), resultDate.getDate(), resultDate.getHours(), resultDate.getMinutes() + 5),
          },
          place,
          position: 'Left',
          $or: [
            { ticket: leftTicketNumber },
            { ticket: Number(this.sumOfDigits(leftTicketNumber).toString()[this.sumOfDigits(leftTicketNumber).toString().length - 1]) },
          ],
        },
      },
      {
        $group: {
          _id: null,
          winnerCountLeft: { $count: {} }, // Count of documents for this place today
          totalDistributedAmountLeft: { $sum: '$returns' }, // Total amount for this place today
        },
      },
    ];

    const ticketWonPipelineRight = [
      {
        $match: {
          time: {
            $gte: new Date(resultDate.getFullYear(), resultDate.getMonth(), resultDate.getDate(), resultDate.getHours(), resultDate.getMinutes() - 5),
            $lt: new Date(resultDate.getFullYear(), resultDate.getMonth(), resultDate.getDate(), resultDate.getHours(), resultDate.getMinutes() + 5),
          },
          place,
          position: 'Right',
          $or: [
            { ticket: rightTicketNumber },
            { ticket: Number(this.sumOfDigits(rightTicketNumber).toString()[this.sumOfDigits(rightTicketNumber).toString().length - 1]) },
          ],
        },
      },
      {
        $group: {
          _id: null,
          winnerCountRight: { $count: {} }, // Count of documents for this place today
          totalDistributedAmountRight: { $sum: '$returns' }, // Total amount for this place today
        },
      },
    ];

    const ticketWonPipelineDouble = [
      {
        $match: {
          time: {
            $gte: new Date(resultDate.getFullYear(), resultDate.getMonth(), resultDate.getDate(), resultDate.getHours(), resultDate.getMinutes() - 5),
            $lt: new Date(resultDate.getFullYear(), resultDate.getMonth(), resultDate.getDate(), resultDate.getHours(), resultDate.getMinutes() + 5),
          },
          place,
          ticket: Number(
            this.sumOfDigits(leftTicketNumber).toString()[this.sumOfDigits(leftTicketNumber).toString().length - 1] +
              this.sumOfDigits(rightTicketNumber).toString()[this.sumOfDigits(rightTicketNumber).toString().length - 1],
          ),
        },
      },
      {
        $group: {
          _id: null,
          winnerCountDouble: { $count: {} }, // Count of documents for this place today
          totalDistributedAmountDouble: { $sum: '$returns' }, // Total amount for this place today
        },
      },
    ];

    const purchaseDetails = await TicketService.repository.aggregate(ticketPurchasePipeline);
    const winnerDetailsLeft = await TicketService.repository.aggregate(ticketWonPipelineLeft);
    const winnerDetailsRight = await TicketService.repository.aggregate(ticketWonPipelineRight);
    const winnerDetailsDouble = await TicketService.repository.aggregate(ticketWonPipelineDouble);

    await this.create({
      time,
      place,
      leftTicketNumber,
      winnerCountLeft: winnerDetailsLeft[0]?.winnerCountLeft || 0,
      totalDistributedAmountLeft: winnerDetailsLeft[0]?.totalDistributedAmountLeft || 0,
      winnerCountRight: winnerDetailsRight[0]?.winnerCountRight || 0,
      totalDistributedAmountRight: winnerDetailsRight[0]?.totalDistributedAmountRight || 0,
      winnerCountDouble: winnerDetailsDouble[0]?.winnerCountDouble || 0,
      totalDistributedAmountDouble: winnerDetailsDouble[0]?.totalDistributedAmountDouble || 0,
      ticketCount: purchaseDetails[0]?.ticketCount || 0,
      totalCollectedAmount: purchaseDetails[0]?.totalCollectedAmount || 0,
    });

    await this.updateTicketWonAndUser(time, place, 'Left', leftTicketNumber);
    await this.updateTicketWonAndUser(
      time,
      place,
      'Left',
      Number(this.sumOfDigits(leftTicketNumber).toString()[this.sumOfDigits(leftTicketNumber).toString().length - 1]),
    );
    setTimeout(async () => this.repository.updateOne({ time, place }, { $set: { rightTicketNumber } }), 15 * 60 * 1000);
    setTimeout(async () => await this.updateTicketWonAndUser(time, place, 'Right', rightTicketNumber), 15 * 60 * 1000);
    setTimeout(
      async () =>
        await this.updateTicketWonAndUser(
          time,
          place,
          'Right',
          Number(this.sumOfDigits(rightTicketNumber).toString()[this.sumOfDigits(rightTicketNumber).toString().length - 1]),
        ),
      15 * 60 * 1000,
    );
    setTimeout(
      async () =>
        await this.updateTicketWonAndUser(
          time,
          place,
          null,
          Number(
            this.sumOfDigits(leftTicketNumber).toString()[this.sumOfDigits(leftTicketNumber).toString().length - 1] +
              this.sumOfDigits(rightTicketNumber).toString()[this.sumOfDigits(rightTicketNumber).toString().length - 1],
          ),
        ),
      15 * 60 * 1000,
    );
    return {
      type: 'success',
      statusCode: 200,
      message: 'Ticket number released',
      time,
      place,
    };
  }

  updateTicketWonAndUser = async (time: number, place: string, position: 'Left' | 'Right' | null, ticketNumber: number) => {
    const wonTickets = await TicketService.repository.find({ time: new Date(time), place, position, ticket: { $eq: ticketNumber } });
    const resultDate = new Date(time);

    await TicketService.repository.updateMany(
      {
        time: {
          $gte: new Date(resultDate.getFullYear(), resultDate.getMonth(), resultDate.getDate(), resultDate.getHours(), resultDate.getMinutes() - 5),
          $lt: new Date(resultDate.getFullYear(), resultDate.getMonth(), resultDate.getDate(), resultDate.getHours(), resultDate.getMinutes() + 5),
        },
        place,
        position,
        ticket: { $eq: ticketNumber },
      },
      { $set: { won: true, result: ticketNumber } },
      { new: true },
    );

    // Add User amount for winners
    return await Promise.all(
      wonTickets.map(async ({ user, returns }) => {
        await ActivityService.create({
          user: user,
          message: `You have won Rs ${returns} from ticket number ${ticketNumber} at position ${position} 
          on ${new Date(time).toLocaleString()} from ${place} city`,
        });
        return await UserService.updateOne({ _id: user }, { $inc: { amount: returns } });
      }),
    );
  };
}

export default ResultService.getInstance();
