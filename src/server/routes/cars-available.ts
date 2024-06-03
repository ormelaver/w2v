import express, { Request, Response } from 'express';
import { query, validationResult } from 'express-validator';

import { Car } from '../utils/car';

const router = express.Router();

router.get(
  '/api/cars/by-date',
  [
    query('date_from')
      .exists()
      .withMessage('date_from is required')
      .isISO8601()
      .withMessage('date_from must be a valid ISO 8601 date')
      .custom((value) => {
        if (new Date(value) <= new Date()) {
          throw new Error('date_from must be greater than the current date');
        }
        return true;
      }),
    query('date_to')
      .exists()
      .withMessage('date_to is required')
      .isISO8601()
      .withMessage('date_to must be a valid ISO 8601 date')
      .custom((value) => {
        if (new Date(value) <= new Date()) {
          throw new Error('date_to must be greater than the current date');
        }
        return true;
      }),
    query('date_to').custom((value, { req }) => {
      if (new Date(value) < new Date(req.query!.date_from)) {
        throw new Error('date_to must be greater than or equal to date_from');
      }
      return true;
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { date_from, date_to } = req.query;

    try {
      const car = await Car.init();
      const cars = await car.getCarsAvailableInDateRange(
        date_from as string,
        date_to as string
      );
      res.status(200).send(cars);
    } catch (error) {
      console.error('Error fetching cars by availability:', error);
      res.status(400).send({ message: "Couldn't fetch available cars" });
    }
  }
);

export { router as getCarsByDateRangeRouter };
