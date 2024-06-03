import express, { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { Car } from '../utils/car';

const router = express.Router();

router.get('/api/cars', async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let cars;
    const car = await Car.init();
    cars = await car.getAllCars();
    res.status(200).send(cars);
  } catch (error: any) {
    console.error('Error fetching cars:', error);
    res.status(400).send({ message: "Couldn't fetch cars" });
  }
});

export { router as getAllCarsRouter };
