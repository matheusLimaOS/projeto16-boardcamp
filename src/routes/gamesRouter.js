import express from 'express';
import { insertGames,getGames } from '../controllers/gamesController.js';
import { verifyGame } from '../middlewares/gamesMiddlewares.js';

export const gamesRouter = express.Router();

gamesRouter.get('/games',getGames);
gamesRouter.post("/games",verifyGame, insertGames)
