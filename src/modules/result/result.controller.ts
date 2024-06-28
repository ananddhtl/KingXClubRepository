import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '@nestjs/common';
import ResultService from './result.service';
import { PublishResultDto } from './dtos/publish-result.dto';

export class ResultController {
  static instance: null | ResultController;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor(private resultService = ResultService) {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new ResultController();
    }
    return this.instance;
  }
  // Route: POST: /v1/category/create
  public publishResult = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { time, place, leftTicketNumber, rightTicketNumber }: PublishResultDto = req.body;
      const response = await this.resultService.publishResult(time, place, leftTicketNumber, rightTicketNumber);
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };

  // Route: GET: /v1/category/all
  public getResult = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { time, place } = req.query;
      const response = await this.resultService.find({ place, time: new Date(time as string) });
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };

  // Route: GET: /v1/category/all
  public findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.resultService.repository.find({}).sort({ time: -1 }).limit(50);
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };

  // Route: GET: /v1/category/:id
  public findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const response = await this.resultService.findById(id);
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };

  // Route: PUT: /v1/category/:id
  public updateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const response = await this.resultService.updateById(id, data);
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };

  // Route: DELETE: /v1/category/:id
  public deleteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const response = await this.resultService.deleteOne({ _id: id });
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };
}

export default ResultController.getInstance();
