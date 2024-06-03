import express, { Request, Response } from 'express';
import { query, validationResult } from 'express-validator';

import { Car } from '../utils/car';
import { Size } from '../types/Car';

const router = express.Router();

router.get(
  '/api/cars/by-size',
  [
    query('size')
      .exists()
      .withMessage('size is required')
      .isIn(['small', 'medium', 'large'])
      .withMessage('Size must be one of small, medium, large'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let cars;
      const car = await Car.init();
      const size = req.query.size as Size;
      cars = await car.filterCarsBySize(size);
      res.status(200).send(cars);
    } catch (error: any) {
      console.error('Error fetching cars by size:', error);
      res.status(400).send({ message: "Couldn't fetch cars" });
    }
  }
);

export { router as getCarsBySizeRouter };
