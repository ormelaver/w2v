import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { Order } from '../utils/order';
import { Car } from '../utils/car';

const router = express.Router();

router.post(
  '/api/orders',
  [
    body('cid').not().isEmpty().withMessage('car id must be provided'),
    body('uid').not().isEmpty().withMessage('user id must be provided'),
    body('date_from').exists().withMessage('date_from is required'),
    body('date_to').exists().withMessage('date_to is required'),
    body('date_from')
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

    body('date_to')
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

    body('date_to').custom((value, { req }) => {
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

    try {
      const carInstance = await Car.init();
      const car = await carInstance.getCarById(req.body.cid);

      if (car.length < 1) {
        throw new Error('cid does not exist');
      }
      const order = await Order.init();
      const success = await order.addOrder(
        req.body.cid,
        req.body.uid,
        req.body.date_from,
        req.body.date_to
      );

      res.status(201).send(success);
    } catch (error) {
      console.error('Error adding order:', error);
      res.status(400).send({ message: "Couldn't save order" });
    }
  }
);

export { router as addNewOrderRouter };
