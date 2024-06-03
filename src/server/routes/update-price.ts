import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { Car } from '../utils/car';

const router = express.Router();

router.patch(
  '/api/cars/update-price',
  [
    body('cid').exists().withMessage('cid is required'),
    body('new_price').exists().withMessage('new price is required'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const cidInt = parseInt(req.body.cid as string);
      const new_price_float = parseFloat(req.body.new_price as string);
      const carInstance = await Car.init();
      const car = await carInstance.getCarById(cidInt);

      if (car.length < 1) {
        throw new Error('cid does not exist');
      }

      const success = await carInstance.updatePrice(cidInt, new_price_float);
      res.status(200).send(success);
    } catch (error) {
      console.error('Error adding order:', error);
      res.status(400).send({ message: "Couldn't delete car" });
    }
  }
);

export { router as updatePriceRouter };
