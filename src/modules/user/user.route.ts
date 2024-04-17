import { Router } from 'express';
import UserController from './user.controller';
import { AppConfig } from '@/config';
import { Routes } from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import { adminOnly, currentOnly } from '@/middlewares/access.middleware';

class UserRoute implements Routes {
  public path = `/${AppConfig.versioning}/user`;
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/me`, [authMiddleware], UserController.getLoggedinUserDetails);
    this.router.delete(`${this.path}/me`, [authMiddleware], UserController.deleteLoggedinUserDetails);
    this.router.get(`${this.path}/all`, [authMiddleware, adminOnly()], UserController.findAll);
    this.router
      .route(`${this.path}/:userId`)
      .put([authMiddleware, currentOnly()], UserController.updateById)
      .get([authMiddleware, currentOnly()], UserController.findById)
      .delete([authMiddleware, adminOnly()], UserController.deleteById);
  }
}

export default UserRoute;
