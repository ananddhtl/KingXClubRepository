import { Request, Response, NextFunction } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';
import ResultService from './result.service';
import { PublishResultDto } from './dtos/publish-result.dto';
import httpStatus from 'http-status';
import { CLUBS } from '@/constants';

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
      const { time, place, ticketNumber, position }: PublishResultDto = req.body;
      if (ticketNumber.length !== 3) throw new HttpException('Number must be 3 digit', httpStatus.CONFLICT);

      const possibleTime = (CLUBS.find(club => club.place === place)?.time || [])
        .map(timestamp => {
          const time = new Date().setHours(
            Number(timestamp.split(':')[0]) * 24 + Number(timestamp.split(':')[1]),
            Number(timestamp.split(':')[2]),
            0,
            0,
          );
          if (Number(timestamp.split(':')[0]) === 1) {
            const previousTime = new Date().setHours(Number(timestamp.split(':')[1]), Number(timestamp.split(':')[2]), 0, 0);
            return [time, previousTime];
          }
          return time;
        })
        .flat();

      if (!possibleTime.includes(time)) throw new HttpException('Result Time doesnot match, please try again', httpStatus.CONFLICT);

      const response =
        position === 'Open'
          ? await this.resultService.publishLeftResult(time, place, ticketNumber)
          : position === 'Close'
          ? await this.resultService.publishRightResult(time, place, ticketNumber)
          : () => {
              throw new HttpException('error releasing ticket number', httpStatus.CONFLICT);
            };

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
      const response = await this.resultService.repository.find({}).sort({ time: -1 }).limit(620);
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
