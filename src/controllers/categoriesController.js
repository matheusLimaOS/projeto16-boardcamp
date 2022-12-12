import { connection } from '../database/database.js';

export async function getCategories(req,res){
    let {limit,offset} = req.query;
    let query = `select * from categories
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

export async function insertCategory(req,res){
    try{
        let {name} = res.locals.category;
        const data = await connection.query(`insert into categories(name) values('${name}')`);

        return res.status(201).send("Categoria criada com sucesso");
    }
    catch(e){
        console.log(e);
        return res.status(500).send("Erro interno do sistema");
    }
}    