import express from 'express';
import { verifyRental,verifyReturnRental,verifyDeleteRental } from '../middlewares/rentalsMiddlewares.js';
import { getRentals,insertRental,returnRental,deleteRental, getRentalsMetrics } from '../controllers/rentalsControllers.js';


export const rentalsRouter = express.Router();

rentalsRouter.get('/rentals',getRentals);
rentalsRouter.get('/rentals/metrics',getRentalsMetrics);
rentalsRouter.post("/rentals",verifyRental, insertRental);
rentalsRouter.post("/rentals/:id/return",verifyReturnRental, returnRental);
rentalsRouter.delete("/rentals/:id",verifyDeleteRental, deleteRental);
