import {rentalsSchema} from "../schemas/rentalsSchema.js";
import { connection } from '../database/database.js';
import dayjs from "dayjs";

export async function verifyRental(req,res,next){
    let {customerId,gameId,daysRented} = req.body;
    let rental ={
        customerId,
        gameId,
        daysRented
    }

    const verifyGame = await connection.query(`select * from games where id = ${gameId}`);
    const verifyCustomer = await connection.query(`select * from customers where id = ${customerId}`);
    const quantJogosAlugados = await connection.query(`select count(id) from rentals where "gameId" = ${gameId} and "returnDate" IS NULL`);

    console.log(verifyGame.rows[0].stockTotal,Number(quantJogosAlugados.rows[0].count))

    if(verifyGame.rows.length === 0){
        return res.status(400).send("Jogo não encontrado!");
    }
    else if(verifyCustomer.rows.length === 0){
        return res.status(400).send("Cliente não encontrado!");
    }
    else if(verifyGame.rows[0].stockTotal <= Number(quantJogosAlugados.rows[0].count)){
        return res.status(400).send("Todos os jogos estão alugados!");
    }
    else{
        let validation = rentalsSchema.validate(rental,{abortEarly:false});

        if(validation.error){
            const erros = validation.error.details.map((detail) => detail.message);
            res.status(400).send(erros);
            return;
        }
        res.locals.rental = {
            ...rental,
            price : ((verifyGame.rows[0].pricePerDay) * (daysRented))
        };

        next();
    }
}

export async function verifyReturnRental(req,res,next){
    let {id} = req.params;

    const verifyRental = await connection.query(`select * from rentals where id = ${id}`);
    if(verifyRental.rows.length === 0){
        return res.status(404).send("Locação não encontrada");
    }
    else if(verifyRental.rows[0].returnDate !== null){
        return res.status(400).send("Locação já encerrada");
    }
    else{
        let date1 = dayjs();
        let date2 = dayjs(verifyRental.rows[0].rentDate)
        let datediff = date1.diff(date2,'day');
        let delayFee = 0

        if(datediff > verifyRental.rows[0].daysRented){
            delayFee = (datediff-verifyRental.rows[0].daysRented) * (verifyRental.rows[0].originalPrice/verifyRental.rows[0].daysRented);
        }

        res.locals.returnRental = {
            id:id,
            date:date1,
            delayFee: delayFee
        };

        next();
    }

}

export async function verifyDeleteRental(req,res,next){
    let {id} = req.params;

    const verifyRental = await connection.query(`select * from rentals where id = ${id}`);
    if(verifyRental.rows.length === 0){
        return res.status(404).send("Locação não encontrada");
    }
    else if(verifyRental.rows[0].returnDate === null){
        return res.status(400).send("Locação ainda não está encerrada");
    }
    else{
        res.locals.deleteRental = {
            id:id,
        };

        next();
    }

}