import { Types } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MessagesMapping } from '@/config/messages-mapping';
import { BaseService } from '../base/base.service';
import { ITicket, ITicketDocument } from './ticket.interface';
import CategoryModel from './ticket.modal';
import UserService from '../user/user.service';

@Injectable()
export class CategoryService extends BaseService<ITicketDocument> {
  static instance: null | CategoryService;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor(repository = CategoryModel) {
    super(repository);
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new CategoryService();
    }
    return this.instance;
  }

  async buyTicket(buyticket: ITicket): Promise<ITicketDocument> {
    const result = await this.repository.create(buyticket);
    //Deduct User amount
    UserService.updateOne({ _id: buyticket.user }, { $inc: { amount: -buyticket.amount } });

    return result;
  }

  async publishResult(time: number, place: string, result: number) {
    const user = await this.repository.updateMany(
      { time, place, ticket: { $eq: result } },
      { $set: { result, won: true } },
      { returnDocument: 'after' },
    );
    console.log({ user });

    //Deduct User amount
    // UserService.updateOne({ _id: buyticket.user }, { $inc: { amount: -buyticket.amount } });

    return result;
  }
}

export default CategoryService.getInstance();
