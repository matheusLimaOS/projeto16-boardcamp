import { connection } from '../database/database.js';

export async function getGames(req,res){
    let {name,limit,offset,order,desc} = req.query;
    let query = `select g.*,c.name as "categoryName" , count(r.id)::int as rentalsCount  from games g
        left join rentals r on g.id  = r."gameId"
        join categories c on c.id = g."categoryId"
        ${name===undefined?"":`where LOWER(g."name") like LOWER('${name}%')`}
        group by g.id, c."name" 
        ${limit===undefined?"":`limit ${limit}`}
        ${offset===undefined?"":`offset ${offset}`}
        ${order ===undefined?"": `order by ${order} ${desc==='true' ? `desc ` :`asc `}`}
    `

    try{
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
