const express = require("express");
require('dotenv').config()
const {connection} = require("./config/connection");
const { userRouter } = require("./routes/user_router");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const cors = require("cors");
const { Message } = require("./models/messagemodel");


app.use(cors())
app.use(express.json());
app.use(userRouter);


app.get("/",(req,res)=>{
    res.send("Home page")
});

io.on(connection,(socket)=>{
    console.log("user connecteds");

    socket.on("join",(room)=>{
        socket.join(room)
    })

    socket.on("message",(data)=>{
        const newmsg = new Message({
            sender:data.sender,
            recipient:data.recipient,
            message:data.message
        })

        newmsg.save()

        io.to(data.room).emit("message",newmsg)
        
    })
    socket.on("dosconnect",()=>{
        console.log("user disconnected")
    })

})


app.listen(process.env.port,async()=>{
    try {
        await connection 
        console.log("connected to db");
        console.log(`Running on port ${process.env.port}`)
    } catch (error) {
        console.log(error)
    }
  
})