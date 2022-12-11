import express from 'express';
import { getCustomers, getCustomersByID, insertCustomers, updateCustomers } from '../controllers/customersController.js';
import { verifyCustomer,verifyCustomerToUpdate } from '../middlewares/customersMiddlewares.js';

export const customersRouter = express.Router();

customersRouter.get('/customers',getCustomers);
customersRouter.get('/customers/:id',getCustomersByID);
customersRouter.post("/customers",verifyCustomer, insertCustomers)
customersRouter.put("/customers/:id",verifyCustomerToUpdate, updateCustomers)
