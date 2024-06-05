import express from 'express';
import { Server } from 'socket.io';
import http from 'http';


const app=express();

const port=5000;
const server=http.createServer(app);

app.get("/",(req,res,next)=>{
    return res.send("welcome to express server")
})
const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials:true //for sending cookies in request.
    }
});

const user=true;
io.use((socket,next)=>{
    if(!user){
        return new Error("user is not authenticated!!!");
    }
    else{
        next();
    }


});


io.on("connection",(socket)=>{
    console.log("user is connected");
    socket.emit("welcome","welcome to the server");
    console.log(socket.id);

    socket.broadcast.emit("other_user",`broadcasting to other user ${socket.id}`);
    socket.on("message",({message,rooms})=>{
        console.log(message,rooms);
        socket.to(rooms).emit("receive_message",message);
    });

    socket.on("join_room",(roomName)=>{
        socket.join(roomName);
        console.log(`user has joined the rooms ${roomName}`);
    })



    
})




server.listen(port,()=>{
    console.log(`server is running at port ${port}`);
})