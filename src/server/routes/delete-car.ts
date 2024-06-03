import express, { Request, Response } from 'express';
import { param, validationResult } from 'express-validator';

import { Car } from '../utils/car';

const router = express.Router();

router.delete(
  '/api/cars/:cid',
  [param('cid').exists().withMessage('cid is required')],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const cidInt = parseInt(req.params.cid);
      const carInstance = await Car.init();
      const car = await carInstance.getCarById(cidInt);

      if (car.length < 1) {
        throw new Error('cid does not exist');
      }

      const success = await carInstance.deleteCar(cidInt);
      res.status(200).send(success);
    } catch (error) {
      console.error('Error adding order:', error);
      res.status(400).send({ message: "Couldn't delete car" });
    }
  }
);

export { router as deleteCarRouter };
