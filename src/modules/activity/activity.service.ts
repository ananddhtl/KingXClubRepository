import { BaseService } from '../base/base.service';
import ActivityModel from './activity.modal';
import { IActivityDocument } from './activity.interface';

export class ActivityService extends BaseService<IActivityDocument> {
  static instance: null | ActivityService;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor(repository = ActivityModel) {
    super(repository);
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ActivityService();
    }
    return this.instance;
  }
}

export default ActivityService.getInstance();
