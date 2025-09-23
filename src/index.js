import express from 'express'
import dotenv from 'dotenv'
import routes from './routes/index.js';
import dbInit from './models/db/init.js';

const app=express();
dotenv.config()

const PORT=process.env.PORT

app.use(express.json())

app.use('/api/v1',routes)

app.get('/',(req,res)=>{
    res.send("Welcome to Book Store");

})

app.listen(PORT,()=>{
    console.log("server is running on port number",PORT)
})

dbInit();