import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUserDocument } from './user.interface';
import UserModel from './user.modal';
import { MessagesMapping } from '@/config/messages-mapping';
import { BaseService } from '../base/base.service';

@Injectable()
export class UserService extends BaseService<IUserDocument> {
  static instance: null | UserService;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor(repository = UserModel) {
    super(repository);
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new UserService();
    }
    return this.instance;
  }

  async getLoggedinUserDetails(userId: string): Promise<IUserDocument> {
    const user = await this.repository.findById(userId);

    if (!user) {
      throw new HttpException(MessagesMapping['#9'], HttpStatus.NOT_FOUND);
    }

    user.password = undefined;

    return user;
  }

  async deleteLoggedinUserDetails(userId: string): Promise<any> {
    const user = await this.repository.deleteOne({ _id: userId });

    if (!user) {
      throw new HttpException(MessagesMapping['#9'], HttpStatus.NOT_FOUND);
    }

    return user;
  }
}

export default UserService.getInstance();
