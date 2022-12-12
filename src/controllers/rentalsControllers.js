import { connection } from '../database/database.js';
import { getGames } from './gamesController.js';

export async function getRentals(req,res){
    let {customerId,gameId,limit,offset} = req.query;
    let query = `select res.* from (
        select r.*,to_json(res2) as customer,to_json(res3) as game from (
          select c.id,c.name from customers c
          ${customerId===undefined ?"" :` where c.id = ${customerId} `}
        ) res2
        join rentals r on res2.id = r."customerId"
        join (
        	select g.id,g.name,g."categoryId",c2.name as "categoryName" from games g
        	join categories c2 on c2.id = g."categoryId"
            ${gameId===undefined?"":`where g.id = ${gameId} `}
        ) res3 on res3.id = r."gameId"
    ) res
    ${limit===undefined?"":`limit ${limit}`}
    ${offset===undefined?"":`offset ${offset}`}
    ;
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

export async function insertRental(req,res){
    try{
        let {customerId,gameId,daysRented,price} = res.locals.rental;
        let date = new Date();
        let rentDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
        const data = await connection.query(`insert into rentals("customerId","gameId","daysRented","rentDate","originalPrice") values(${customerId},${gameId},${daysRented},'${rentDate}',${price})`);

        return res.status(201).send();
    }
    catch(e){
        console.log(e);
        return res.status(500).send("Erro interno do sistema");
    }
}

export async function returnRental(req,res){
    try{
        let {id,delayFee,date} = res.locals.returnRental;
        const data = await connection.query(`update rentals set "delayFee" = ${delayFee}, "returnDate" = '${date}' where id = ${id}`);
        return res.status(200).send();
    }
    catch(e){
        console.log(e);
        return res.status(500).send("Erro interno do sistema");
    }
}

export async function deleteRental(req,res){
    try{
        let {id} = res.locals.deleteRental;
        const data = await connection.query(`delete from rentals where id = ${id}`);
        return res.status(200).send();
    }
    catch(e){
        console.log(e);
        return res.status(500).send("Erro interno do sistema");
    }
}   