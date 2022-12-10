import express from "express";
import cors from "cors";
import { categoriesRouter } from "./routes/categoriesRouter.js";
import { gamesRouter } from "./routes/gamesRouter.js";
import { customersRouter } from "./routes/customersRouter.js";
import dotenv from "dotenv";
const app = express();

dotenv.config();

app.use(express.json())
app.use(cors());
app.get("/status",(req,res)=>{
    return res.send("OK");
})

app.use(categoriesRouter);
app.use(gamesRouter)
app.use(customersRouter)


app.listen(4000,console.log('On The Line'));