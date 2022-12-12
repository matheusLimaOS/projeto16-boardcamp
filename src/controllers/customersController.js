import { connection } from '../database/database.js';

export async function getCustomers(req,res){
    let {cpf,limit,offset} = req.query;
    let query = `select * from customers c
        ${cpf===undefined?"":`where c.cpf like '${cpf}%'`}
        ${limit===undefined?"":`limit ${limit}`}
        ${offset===undefined?"":`offset ${offset}`}   
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

export async function insertCustomers(req,res){
    try{
        let {name,phone,cpf,birthday} = res.locals.customer;
        const data = await connection.query(`insert into customers(name,phone,cpf,birthday) values('${name}','${phone}','${cpf}','${birthday}')`);

        return res.status(201).send();
    }
    catch(e){
        console.log(e);
        return res.status(500).send("Erro interno do sistema");
    }
}

export async function updateCustomers(req,res){
    try{
        let {id} = req.params
        let {name,phone,cpf,birthday} = res.locals.customer;
        const data = await connection.query(`update customers set name = '${name}', phone = '${phone}',cpf = '${cpf}', birthday = '${birthday}' where id = ${id}`);

        return res.status(201).send();
    }
    catch(e){
        console.log(e);
        return res.status(500).send("Erro interno do sistema");
    }
}

export async function getCustomersByID(req,res){
    let {id} = req.params;

    let query = `select * from customers c where id = ${id}`
    try{
        const data = await connection.query(query);
        if(data.rows.length === 0){
            return res.status(404).send("Usuário não encontrado!");
        }
        else{
            return res.status(200).send(data.rows);
        }
    }
    catch(e){
        console.log(e);
        return res.status(500).send("Erro interno do sistema");
    }
}
