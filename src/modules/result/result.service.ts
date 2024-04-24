import { Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import ResultModel from './result.modal';
import { IResultDocument } from './result.interface';

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

export default ResultService.getInstance();
