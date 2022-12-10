import { categorySchema } from '../schemas/categorySchema.js';
import { connection } from '../database/database.js';
import {stripHtml} from "string-strip-html";

export async function verifyCategory(req,res,next){
    let {name} = req.body;
    let category ={
        name: stripHtml(name === undefined ? "" : name).result.trim()
    }
    const data = await connection.query(`select * from categories where name = '${name}'`);

    if(data.rows.length > 0){
        return res.status(409).send("Categoria já cadastrada!");
    }
    else{
        let validation = categorySchema.validate(category,{abortEarly:false});

        if(validation.error){
            const erros = validation.error.details.map((detail) => detail.message);
            res.status(400).send(erros);
            return;
        }
        res.locals.category = category;

        next();
    }
}