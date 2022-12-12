import { connection } from '../database/database.js';

export async function getRentals(req,res){
    let {customerId,gameId,limit,offset,order,desc,status,startDate} = req.query;
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
            ${status===undefined ? "" : status==='open' ? `where "returnDate" IS NULL` : `where "returnDate" IS NOT NULL`}
            ${startDate===undefined ? "" : `where "rentDate" > '${startDate}'`}
        ) res
        ${limit===undefined?"":`limit ${limit}`}
        ${offset===undefined?"":`offset ${offset}`}
        ${order ===undefined?"": `order by ${order} ${desc==='true' ? `desc` :`asc`}`}
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

export async function getRentalsMetrics(req,res){
    let {startDate,endDate} = req.query;
    let query = `select 
                    (sum("originalPrice")+sum("delayFee")) as revenue, 
                    count(id) as rentals,
                    ((sum("originalPrice")+sum("delayFee"))/count(id)) as average 
                from rentals r
                ${startDate===undefined ? "" : `where "rentDate" => '${startDate}'`}
                ${endDate===undefined ? "" : `where "rentDate" <= '${endDate}'`}
    ;
    `
    try{
        const data = await connection.query(query);

        return res.status(200).send(data.rows[0]);
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