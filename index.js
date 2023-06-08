const express = require("express");
require('dotenv').config()
const {connection} = require("./config/connection");
const { userRouter } = require("./routes/user_router");
const app = express();


const cors = require("cors");
const { Message } = require("./models/messagemodel");


app.use(cors())
app.use(express.json());
app.use(userRouter);


app.get("/",(req,res)=>{
    res.send("Home page")
});




app.listen(process.env.port,async()=>{
    try {
        await connection 
        console.log("connected to db");
        console.log(`Running on port ${process.env.port}`)
    } catch (error) {
        console.log(error)
    }
  
})