import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { Mysql } from '../services/mysql';
import { Car } from '../utils/car';

const router = express.Router();

router.post(
  '/api/cars',
  [
    body('uid').not().isEmpty().withMessage('user id must be provided'),
    body('cars').not().isEmpty().withMessage('car object must be provided'),
    body('cars.*.model').exists().withMessage('car model is required'),
    body('cars.*.size').exists().withMessage('car size is required'),
    body('cars.*.price_per_day')
      .exists()
      .withMessage('car price_per_day is required'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const sql = await Mysql.getInstance();
      const user = await sql.getRowsByEqualCondition(
        'users',
        ['isAdmin'],
        'uid',
        req.body.uid
      );

      if (!user[0].isAdmin) {
        res
          .status(401)
          .send({ message: 'user is unauthorized to perform this action' });
      } else {
        const car = await Car.init();
        const success = await car.addCar(req.body.cars);

        res.status(201).send(success);
      }
    } catch (error: any) {
      console.error('Error adding car:', error);
      res.status(400).send({ message: "Couldn't save car" });
    }
  }
);

export { router as addCarRouter };
