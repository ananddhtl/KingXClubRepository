import { Request, Response, NextFunction } from 'express';
import { Controller, HttpStatus } from '@nestjs/common';
import ResultService from './result.service';

@Controller('result')
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
      const { timestamp, place, result } = req.body;
      const response = await this.resultService.publishResult(timestamp, place, result);
      //@TODO : Update user balance

      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };

  // Route: GET: /v1/category/all
  public getResults = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { timestamp, place, result } = req.body;
      const response = await this.resultService.find({ place, tim });
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      console.error('Error in logging:', error);
      return next(error);
    }
  };

  // Route: GET: /v1/category/all
  public findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.resultService.find({});
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
