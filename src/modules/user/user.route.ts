import { Router } from 'express';
import UserController from './user.controller';
import { AppConfig } from '@/config';
import { Routes } from '@/interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import { masterOnly, AgentOrAgentOnly, userOnly, adminOnly } from '@/middlewares/access.middleware';

class UserRoute implements Routes {
  public path = `/${AppConfig.versioning}/user`;
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/me`, [authMiddleware], UserController.getLoggedinUserDetails);
    this.router.post(`${this.path}/submit/agent-form`, [authMiddleware, userOnly()], UserController.onboardAgent);
    this.router.post(`${this.path}/make/agent`, [authMiddleware, adminOnly(true)], UserController.makeAgent);
    this.router.delete(`${this.path}/me`, [authMiddleware], UserController.deleteLoggedinUserDetails);
    this.router.get(`${this.path}/all`, [authMiddleware, masterOnly()], UserController.findAll);
    this.router.get(`${this.path}/agent/getUser`, [authMiddleware, AgentOrAgentOnly()], UserController.findAllAgentUserDetail);
    this.router.post(`${this.path}/update-balance`, [authMiddleware, AgentOrAgentOnly(true)], UserController.updateBalance);
    this.router
      .route(`${this.path}/:userId`)
      .put([authMiddleware, masterOnly()], UserController.updateById)
      .get([authMiddleware, masterOnly()], UserController.findById)
      .delete([authMiddleware, masterOnly()], UserController.deleteById);
  }
}

export default UserRoute;
