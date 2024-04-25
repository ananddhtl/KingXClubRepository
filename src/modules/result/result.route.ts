import { Router } from 'express';
import ResultController from './result.controller';
import { AppConfig } from '@/config';
import validationMiddleware from '@/middlewares/validation.middleware';
import { Routes } from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import { adminOnly } from '@/middlewares/access.middleware';
import { PublishResultDto } from './dtos/publish-result.dto';

class ResultRoute implements Routes {
  public path = `/${AppConfig.versioning}/result`;
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/publish`, [validationMiddleware(PublishResultDto, 'body')], ResultController.publishResult);
    this.router.get(`${this.path}/all`, ResultController.findAll);
    this.router.get(`${this.path}/get`, ResultController.getResult);
    this.router
      .route(`${this.path}/:id`)
      .get(ResultController.findById)
      .put([authMiddleware, adminOnly()], ResultController.updateById)
      .delete([authMiddleware, adminOnly()], ResultController.deleteById);
  }
}

export default ResultRoute;
