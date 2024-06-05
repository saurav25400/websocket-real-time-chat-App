
// import React from 'react';
import { useEffect,useState,useMemo } from 'react';
import io from 'socket.io-client';

 const App = () => {
  const[message,setMessage]=useState("");
  const[rooms,setRooms]=useState('');
  const [socketId,setSocketId]=useState('');
  const[roomName,setRoomName]=useState('');
  const socket=useMemo(()=>io("http://localhost:5000"));
  function roomHandler(e){
    e.preventDefault();
    socket.emit("join_room",roomName);
    setRoomName("");


  }
  function handleSubmit(e){
    e.preventDefault();
    console.log(rooms);
    console.log(message);
    socket.emit("message",{message,rooms});
    setMessage("");
    
    
  }
  console.log(socket);
  useEffect(()=>{
    socket.on("connect",()=>{
      console.log("connected",socket.id);
      setSocketId(socket.id);
    })
    socket.on("welcome",(data)=>{
      console.log(data);
    });

    socket.on("other_user",(data)=>{
      console.log(data);
    })
    socket.on("disconnect",()=>{
      console.log("user is disconnected",socket.id);
    })

    socket.on("receive_message",(data)=>{
      console.log(data);
    })

    return ()=>{
      socket.disconnect();
    }


  },[]);

  return (
    <>
    <form onSubmit={roomHandler}>
      <h6>Room creation</h6>
      <input type="text"onChange={(e)=>setRoomName(e.target.value)} value={roomName} placeholder="enter your roomName"/>
        <button type="submit">send</button>
    </form>
    <div>
      {socketId?socketId:null}
      <form onSubmit={handleSubmit}>
        <input type="text"onChange={(e)=>setMessage(e.target.value)} value={message} placeholder="enter your message"/>
        <input type="text"onChange={(e)=>setRooms(e.target.value)} value={rooms} placeholder="enter your roomId"/>
        <button type="submit">send</button>

      </form>
    </div>

    </>
  )
}

export default App;
