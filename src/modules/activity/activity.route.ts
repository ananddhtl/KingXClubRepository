import { Router } from 'express';
import ActivityController from './activity.controller';
import { AppConfig } from '@/config';
import { Routes } from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import { adminOnly } from '@/middlewares/access.middleware';

class ActivityRoute implements Routes {
  public path = `/${AppConfig.versioning}/activity`;
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/all`, [authMiddleware, adminOnly()], ActivityController.findAll);
    this.router.get(`${this.path}/me`, authMiddleware, ActivityController.findMyActivity);
    this.router
      .route(`${this.path}/:id`)
      .get([authMiddleware, adminOnly()], ActivityController.findById)
      .put([authMiddleware, adminOnly()], ActivityController.updateById)
      .delete([authMiddleware, adminOnly()], ActivityController.deleteById);
  }
}

export default ActivityRoute;
