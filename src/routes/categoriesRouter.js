import express from 'express';
import { getCategories,insertCategory } from '../controllers/categoriesController.js';
import { verifyCategory } from '../middlewares/categoriesMiddlewares.js';

export const categoriesRouter = express.Router();

categoriesRouter.get('/categories',getCategories);
categoriesRouter.post("/categories",verifyCategory, insertCategory)
