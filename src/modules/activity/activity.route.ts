import { Router } from 'express';
import ActivityController from './activity.controller';
import { AppConfig } from '@/config';
import { Routes } from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import { masterOnly } from '@/middlewares/access.middleware';

class ActivityRoute implements Routes {
  public path = `/${AppConfig.versioning}/activity`;
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/all`, [authMiddleware, masterOnly()], ActivityController.findAll);
    this.router.get(`${this.path}/me`, authMiddleware, ActivityController.findMyActivity);
    this.router
      .route(`${this.path}/:id`)
      .get([authMiddleware, masterOnly()], ActivityController.findById)
      .put([authMiddleware, masterOnly()], ActivityController.updateById)
      .delete([authMiddleware, masterOnly()], ActivityController.deleteById);
  }
}

export default ActivityRoute;
