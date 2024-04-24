import { HttpException, Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { ITicket, ITicketDocument } from './ticket.interface';
import UserService from '../user/user.service';
import httpStatus from 'http-status';
import TicketModel from './ticket.modal';

@Injectable()
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

  async buyTicket(buyticket: ITicket): Promise<ITicketDocument> {
    const result = await this.repository.create(buyticket);
    //Deduct User amount
    const user = await UserService.findOne({ _id: buyticket.user });
    if (user.amount < buyticket.amount) throw new HttpException('Balance not available to buy ticket', httpStatus.FORBIDDEN);
    await UserService.updateOne({ _id: buyticket.user }, { $inc: { amount: -buyticket.amount } });

    return result;
  }
}

export default TicketService.getInstance();
