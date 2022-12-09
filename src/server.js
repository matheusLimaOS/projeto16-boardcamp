import express from "express";
import cors from "cors";
const app = express();


app.use(express.json())
app.use(cors());
app.get("/status",(req,res)=>{
    return res.send("OK");
})

app.listen(4000,console.log('On The Line'));