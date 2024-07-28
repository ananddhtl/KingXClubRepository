import { HttpException } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import ResultModel from './result.modal';
import { IResultDocument } from './result.interface';
import TicketService from '../ticket/ticket.service';
import httpStatus from 'http-status';
import UserService from '../user/user.service';
import ActivityService from '../activity/activity.service';
import { ROLE } from '../user/user.interface';

// const MIN_15_TIMEOUT = 15 * 60 * 1000;
// const HOUR_1_TIMEOUT = 60 * 60 * 1000;

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

  sumOfDigits(value: string) {
    return value.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }

  async publishLeftResult(time: number, place: string, leftTicketNumber: string) {
    const hasAlreadyPublished = await this.repository.findOne({ time, place, leftTicketNumber: { $exists: true } });

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
          position: 'Open',
          $or: [
            { ticket: leftTicketNumber },
            { ticket: Number(this.sumOfDigits(leftTicketNumber).toString()[this.sumOfDigits(leftTicketNumber).toString().length - 1]).toString() },
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

    const purchaseDetails = await TicketService.repository.aggregate(ticketPurchasePipeline);
    const winnerDetailsLeft = await TicketService.repository.aggregate(ticketWonPipelineLeft);
    console.log({ winnerDetailsLeft });

    await this.create({
      time,
      place,
      leftTicketNumber,
      winnerCountLeft: winnerDetailsLeft[0]?.winnerCountLeft || 0,
      totalDistributedAmountLeft: winnerDetailsLeft[0]?.totalDistributedAmountLeft || 0,
      ticketCount: purchaseDetails[0]?.ticketCount || 0,
      totalCollectedAmount: purchaseDetails[0]?.totalCollectedAmount || 0,
    });

    await this.updateTicketWonAndUser(time, place, 'Open', leftTicketNumber);
    await this.updateTicketWonAndUser(
      time,
      place,
      'Open',
      this.sumOfDigits(leftTicketNumber).toString()[this.sumOfDigits(leftTicketNumber).toString().length - 1],
    );
    return {
      type: 'success',
      statusCode: 200,
      message: 'Open Positon Number released',
      time,
      place,
    };
  }

  async publishRightResult(time: number, place: string, rightTicketNumber: string) {
    const hasAlreadyPublished = await this.repository.findOne({ time, place });

    if (hasAlreadyPublished && hasAlreadyPublished?.rightTicketNumber)
      throw new HttpException('close position result already released', httpStatus.CONFLICT);
    const resultDate = new Date(time);

    const ticketWonPipelineRight = [
      {
        $match: {
          time: {
            $gte: new Date(resultDate.getFullYear(), resultDate.getMonth(), resultDate.getDate(), resultDate.getHours(), resultDate.getMinutes() - 5),
            $lt: new Date(resultDate.getFullYear(), resultDate.getMonth(), resultDate.getDate(), resultDate.getHours(), resultDate.getMinutes() + 5),
          },
          place,
          position: 'Close',
          $or: [
            { ticket: rightTicketNumber },
            { ticket: Number(this.sumOfDigits(rightTicketNumber).toString()[this.sumOfDigits(rightTicketNumber).toString().length - 1]).toString() },
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
            this.sumOfDigits(hasAlreadyPublished?.leftTicketNumber).toString()[
              this.sumOfDigits(hasAlreadyPublished?.leftTicketNumber).toString().length - 1
            ] + this.sumOfDigits(rightTicketNumber).toString()[this.sumOfDigits(rightTicketNumber).toString().length - 1],
          ).toString(),
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

    const ticketWonPipelineHalfKing = [
      {
        $match: {
          time: {
            $gte: new Date(resultDate.getFullYear(), resultDate.getMonth(), resultDate.getDate(), resultDate.getHours(), resultDate.getMinutes() - 5),
            $lt: new Date(resultDate.getFullYear(), resultDate.getMonth(), resultDate.getDate(), resultDate.getHours(), resultDate.getMinutes() + 5),
          },
          place,
          $or: [
            {
              ticket: `${
                this.sumOfDigits(hasAlreadyPublished?.leftTicketNumber).toString()[
                  this.sumOfDigits(hasAlreadyPublished?.leftTicketNumber).toString().length - 1
                ]
              }-${rightTicketNumber}`,
            },
            {
              ticket: `${hasAlreadyPublished?.leftTicketNumber}-${
                this.sumOfDigits(rightTicketNumber).toString()[this.sumOfDigits(rightTicketNumber).toString().length - 1]
              }`,
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          winnerCountHalfKing: { $count: {} }, // Count of documents for this place today
          totalDistributedAmountHalfKing: { $sum: '$returns' }, // Total amount for this place today
        },
      },
    ];

    const ticketWonPipelineFullKing = [
      {
        $match: {
          time: {
            $gte: new Date(resultDate.getFullYear(), resultDate.getMonth(), resultDate.getDate(), resultDate.getHours(), resultDate.getMinutes() - 5),
            $lt: new Date(resultDate.getFullYear(), resultDate.getMonth(), resultDate.getDate(), resultDate.getHours(), resultDate.getMinutes() + 5),
          },
          place,
          ticket: `${hasAlreadyPublished?.leftTicketNumber}-${rightTicketNumber}`,
        },
      },
      {
        $group: {
          _id: null,
          winnerCountFullKing: { $count: {} }, // Count of documents for this place today
          totalDistributedAmountFullKing: { $sum: '$returns' }, // Total amount for this place today
        },
      },
    ];

    const winnerDetailsRight = await TicketService.repository.aggregate(ticketWonPipelineRight);
    const winnerDetailsDouble = await TicketService.repository.aggregate(ticketWonPipelineDouble);
    const winnerDetailsHalfKing = await TicketService.repository.aggregate(ticketWonPipelineHalfKing);
    const winnerDetailsFullKing = await TicketService.repository.aggregate(ticketWonPipelineFullKing);

    await this.repository.updateMany(
      {
        time,
        place,
      },
      {
        $set: {
          winnerCountRight: winnerDetailsRight[0]?.winnerCountRight || 0,
          totalDistributedAmountRight: winnerDetailsRight[0]?.totalDistributedAmountRight || 0,
          winnerCountDouble: winnerDetailsDouble[0]?.winnerCountDouble || 0,
          totalDistributedAmountDouble: winnerDetailsDouble[0]?.totalDistributedAmountDouble || 0,
          winnerCountHalfKing: winnerDetailsHalfKing[0]?.winnerCountHalfKing || 0,
          totalDistributedAmountHalfKing: winnerDetailsHalfKing[0]?.totalDistributedAmountHalfKing || 0,
          winnerCountFullKing: winnerDetailsFullKing[0]?.winnerCountFullKing || 0,
          totalDistributedAmountFullKing: winnerDetailsFullKing[0]?.totalDistributedAmountFullKing || 0,
        },
      },
      { new: true },
    );

    await this.repository.updateOne({ time, place }, { $set: { rightTicketNumber } });

    //right triple
    await this.updateTicketWonAndUser(time, place, 'Close', rightTicketNumber);

    //right single
    await this.updateTicketWonAndUser(
      time,
      place,
      'Close',
      this.sumOfDigits(rightTicketNumber).toString()[this.sumOfDigits(rightTicketNumber).toString().length - 1],
    );

    //double
    await this.updateTicketWonAndUser(
      time,
      place,
      null,
      this.sumOfDigits(hasAlreadyPublished?.leftTicketNumber).toString()[
        this.sumOfDigits(hasAlreadyPublished?.leftTicketNumber).toString().length - 1
      ] + this.sumOfDigits(rightTicketNumber).toString()[this.sumOfDigits(rightTicketNumber).toString().length - 1],
    );

    //half king
    await this.updateTicketWonAndUser(
      time,
      place,
      null,
      `${
        this.sumOfDigits(hasAlreadyPublished?.leftTicketNumber).toString()[
          this.sumOfDigits(hasAlreadyPublished?.leftTicketNumber).toString().length - 1
        ]
      }-${rightTicketNumber}`,
    );

    await this.updateTicketWonAndUser(
      time,
      place,
      null,
      `${hasAlreadyPublished?.leftTicketNumber}-${
        this.sumOfDigits(rightTicketNumber).toString()[this.sumOfDigits(rightTicketNumber).toString().length - 1]
      }`,
    );

    //full king
    await this.updateTicketWonAndUser(time, place, null, `${hasAlreadyPublished?.leftTicketNumber}-${rightTicketNumber}`);
    return {
      type: 'success',
      statusCode: 200,
      message: 'Close Positon Number released',
      time,
      place,
    };
  }

  updateTicketWonAndUser = async (time: number, place: string, position: 'Open' | 'Close' | null, ticketNumber: string) => {
    const wonTickets = await TicketService.repository.find({ time: new Date(time), place, position, ticket: { $eq: ticketNumber.toString() } });
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
    let totalReturns = 0;
    const distributeRewardPromise = wonTickets.map(async ({ user, returns }) => {
      totalReturns += returns;
      await ActivityService.create({
        user: user,
        balanceChange: returns,
        message: `You have won Rs ${returns} from ticket number ${ticketNumber} at position ${position} 
        on ${new Date(time).toLocaleString()} from ${place} city`,
      });
      return await UserService.updateOne({ _id: user }, { $inc: { amount: returns } });
    });
    const master = await UserService.repository.findOneAndUpdate({ role: ROLE.MASTER }, { $inc: { amount: -totalReturns } });
    await ActivityService.create({
      user: master._id,
      balanceChange: -totalReturns,
      message: `Distribute amount: ${totalReturns} for ticket: ${ticketNumber} at position ${position} 
      on ${new Date(time).toLocaleString()} for club ${place}`,
    });
    return await Promise.all(distributeRewardPromise);
  };
}

export default ResultService.getInstance();
