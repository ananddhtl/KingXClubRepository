import { HttpException } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { ITicket, ITicketDocument } from './ticket.interface';
import UserService from '../user/user.service';
import httpStatus from 'http-status';
import TicketModel from './ticket.modal';

export class TicketService extends BaseService<ITicketDocument> {
  static instance: null | TicketService;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor(repository = TicketModel) {
    super(repository);
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new TicketService();
    }
    return this.instance;
  }

  async buyTicket(userId: string, buyticket: ITicket[], totalAmount: number) {
    //Deduct User amount
    const user = await UserService.findOne({ _id: userId });
    if (user.amount < totalAmount) throw new HttpException('Balance not available to buy ticket', httpStatus.FORBIDDEN);
    await UserService.updateOne({ _id: userId }, { $inc: { amount: -totalAmount } });

    const result = await this.repository.create(buyticket);
    return result;
  }
}

export default TicketService.getInstance();
