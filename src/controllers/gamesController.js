import { connection } from '../database/database.js';

export async function getGames(req,res){
    let {name} = req.query;
    let query = `select g.*,c.name as "categoryName" from games g join categories c on c.id = g."categoryId"`
    try{
        if(name !== undefined){
            query += `where LOWER(g."name") like LOWER('${name}%')`;
        }
        const data = await connection.query(query);
        return res.status(200).send(data.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).send("Erro interno do sistema");
    }
}

export async function insertGames(req,res){
    try{
        let {name,image,stockTotal,categoryId,pricePerDay} = res.locals.game;7
        const data = await connection.query(`insert into games(name,Image,"stockTotal","categoryId","pricePerDay") values('${name}','${image}','${stockTotal}',${categoryId},${pricePerDay})`);

        return res.status(201).send();
    }
    catch(e){
        console.log(e);
        return res.status(500).send("Erro interno do sistema");
    }
}    