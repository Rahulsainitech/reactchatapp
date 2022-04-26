const express = require("express")
const app = express()
const dotnev = require("dotenv")
// const chats = require("./data/data")
const morgan = require("morgan")
const userRoute  = require("./routes/userRoute")
const chatRoutes  = require("./routes/chatRoutes")
const messageRoutes  = require("./routes/messageRoutes")
const {notFound,errorHandler} = require("./middleware/errorMiddleware")
const conectionDb = require("./config/db")
dotnev.config()
const path=require("path")

conectionDb()
app.use(express.json()); 
app.use(morgan("dev"))

app.use("/api/users",userRoute)
app.use("/api/chat",chatRoutes)
app.use("/api/message",messageRoutes)

// ----------deployment-----------
if(process.env.NODE_ENV=== 'production'){
 app.use(express.static(path.join(__dirname,'client/build')))
 app.get("*",(req,res)=>{
     res.sendFile(path.resolve(__dirname,"client","build","index.html"))
 })
} 
else
{
    app.get("/",(req,res)=>{
        res.send("api is running successfullly")
    })
}
//----------deployment------------

app.use(notFound)
app.use(errorHandler)

const port =  process.env.PORT || 5000;

const server = app.listen(port,()=>{
    console.log(`server is listeinig on ${port}`)
})

const io = require("socket.io")(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000"
    }
})

io.on("connection",(socket)=>{
    console.log("connected to socket.io")
    socket.on("setup",(userData)=>{
        socket.join(userData._id);
        console.log(userData._id)
        socket.emit("connected");
    })

    socket.on("join chat",(room)=>{
        socket.join(room);
        console.log("User Joined Room: "+room)
    })

    socket.on("typing",(room)=>socket.in(room).emit("typing"));
    socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"));

    socket.on("new message",(newMessageRecieved)=>{
        var chat = newMessageRecieved.chat;
        if(!chat.users) return console.log("chat.users not defined")
        chat.users.forEach(user => {
            if(user._id==newMessageRecieved.sender._id) return;
            socket.in(user._id).emit("message recieved",newMessageRecieved)
        });
    })
  socket.off("setup",()=>{
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
  })
});