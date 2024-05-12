import { Router } from 'express';
import TicketController from './ticket.controller';
import { AppConfig } from '@/config';
import validationMiddleware from '@/middlewares/validation.middleware';
import { Routes } from '@/interfaces/routes.interface';
import { BuyTicketDto } from './dtos/buy-ticket.dto';
import authMiddleware from '@/middlewares/auth.middleware';
import { adminOnly } from '@/middlewares/access.middleware';

class BetRoute implements Routes {
  public path = `/${AppConfig.versioning}/ticket`;
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/buy`, [validationMiddleware(BuyTicketDto, 'body'), authMiddleware], TicketController.buyTicket);
    this.router.get(`${this.path}/all`, [authMiddleware, adminOnly()], TicketController.findAll);
    this.router.get(`${this.path}/me`, authMiddleware, TicketController.findAllTicketPurchased);
    this.router.get(`${this.path}/today`, TicketController.getTodayTicketDetails);
    this.router.get(`${this.path}/today/all`, [authMiddleware, adminOnly()], TicketController.getTodayPurchasedTicket);
    this.router.get(`${this.path}/lucky-winners`, TicketController.getLuckyWinners);
    this.router
      .route(`${this.path}/:id`)
      .get(TicketController.findById)
      .put([authMiddleware, adminOnly()], TicketController.updateById)
      .delete([authMiddleware, adminOnly()], TicketController.deleteById);
  }
}

export default BetRoute;
