import express from 'express';
import { json } from 'body-parser';
// import cors from 'cors';

import { getAllCarsRouter } from './routes/get-cars';
import { addCarRouter } from './routes/add-car';
import { getCarsBySizeRouter } from './routes/cars-size';
import { getCarsByDateRangeRouter } from './routes/cars-available';
import { addNewOrderRouter } from './routes/add-order';
import { deleteCarRouter } from './routes/delete-car';
import { updatePriceRouter } from './routes/update-price';

const app = express();
app.set('trust proxy', true);

app.use(json());
// app.use(cors());

app.use(getAllCarsRouter);
app.use(addCarRouter);
app.use(getCarsBySizeRouter);
app.use(getCarsByDateRangeRouter);
app.use(addNewOrderRouter);
app.use(deleteCarRouter);
app.use(updatePriceRouter);

app.all('*', async (req, res) => {
  throw new Error('route not found');
});

export { app };
