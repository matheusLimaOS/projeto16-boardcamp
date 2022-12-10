import { connection } from '../database/database.js';
import {stripHtml} from "string-strip-html";
import { customersSchema } from '../schemas/customersSchema.js';

export async function verifyCustomer(req,res,next){
    let {name,phone,cpf,birthday} = req.body;
    let customer ={
        name: stripHtml(name === undefined ? "" : name).result.trim(),
        phone: stripHtml(phone === undefined ? "" : phone).result.trim(),
        cpf: stripHtml(cpf === undefined ? "" : cpf).result.trim(),
        birthday: birthday
    }

    const verifyCpf = await connection.query(`select * from customers where cpf = '${customer.cpf}'`);

    if(verifyCpf.rows.length > 0){
        return res.status(409).send("Cliente já cadastrado!");
    }
    else if(isNaN(Date.parse(birthday))){
        res.status(400).send("Birthday deve ser uma datá valida"); 
    }
    else{
        let validation = customersSchema.validate(customer,{abortEarly:false});

        if(validation.error){
            const erros = validation.error.details.map((detail) => detail.message);
            res.status(400).send(erros);
            return;
        }
        res.locals.customer = customer;

        next();
    }
}

export async function verifyCustomerToUpdate(req,res,next){
    let {name,phone,cpf,birthday} = req.body;
    let {id} = req.params;

    let customer ={
        name: stripHtml(name === undefined ? "" : name).result.trim(),
        phone: stripHtml(phone === undefined ? "" : phone).result.trim(),
        cpf: stripHtml(cpf === undefined ? "" : cpf).result.trim(),
        birthday: birthday
    }

    const verifyCpf = await connection.query(`select * from customers where cpf = '${customer.cpf}'`);
    const verifyID = await connection.query(`select * from customers where id = '${id}'`);

    if(verifyCpf.rows.length > 0){
        return res.status(409).send("Cliente já cadastrado!");
    }
    else if(isNaN(Date.parse(birthday))){
        res.status(400).send("Birthday deve ser uma datá valida!"); 
    }
    else if(isNaN(Date.parse(birthday))){
        res.status(404).send("Usuário não encontrado!"); 
    }
    else{
        let validation = customersSchema.validate(customer,{abortEarly:false});

        if(validation.error){
            const erros = validation.error.details.map((detail) => detail.message);
            res.status(400).send(erros);
            return;
        }
        res.locals.customer = customer;

        next();
    }
}