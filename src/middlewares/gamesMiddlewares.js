import { connection } from '../database/database.js';
import {stripHtml} from "string-strip-html";
import { gamesSchema } from '../schemas/gamesSchema.js';


export async function verifyGame(req,res,next){
    let {name,image,stockTotal,categoryId,pricePerDay} = req.body;
    let game ={
        name: stripHtml(name === undefined ? "" : name).result.trim(),
        image: stripHtml(image === undefined ? "" : image).result.trim(),
        stockTotal: stockTotal,
        categoryId: categoryId,
        pricePerDay: pricePerDay
    }
    const categoria = await connection.query(`select * from categories where id = ${game.categoryId}`);
    const nome = await connection.query(`select * from games where name = '${game.name}'`);

    if(nome.rows.length > 0){
        return res.status(409).send("Jogo já cadastrado!");
    }
    else if(categoria.rows.length === 0){
        return res.status(400).send("Categoria não encontrada");
    }
    else{
        let validation = gamesSchema.validate(game,{abortEarly:false});

        if(validation.error){
            const erros = validation.error.details.map((detail) => detail.message);
            res.status(400).send(erros);
            return;
        }
        res.locals.game = game;

        next();
    }
}