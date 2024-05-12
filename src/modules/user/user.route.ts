import { Router } from 'express';
import multer from 'multer';
import UserController from './user.controller';
import { AppConfig } from '@/config';
import { Routes } from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import { adminOnly } from '@/middlewares/access.middleware';

class UserRoute implements Routes {
  public path = `/${AppConfig.versioning}/user`;
  public router = Router();
  private upload = multer({
    dest: 'uploads/', // Temporary directory for storing uploaded files
  });

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/me`, [authMiddleware], UserController.getLoggedinUserDetails);
    this.router.post(`${this.path}/agent-form`, this.upload.single('file'), UserController.onboardAgent);
    this.router.delete(`${this.path}/me`, [authMiddleware], UserController.deleteLoggedinUserDetails);
    this.router.get(`${this.path}/all`, [authMiddleware, adminOnly()], UserController.findAll);
    this.router
      .route(`${this.path}/:userId`)
      .put([authMiddleware, adminOnly()], UserController.updateById)
      .get([authMiddleware, adminOnly()], UserController.findById)
      .delete([authMiddleware, adminOnly()], UserController.deleteById);
  }
}

export default UserRoute;
