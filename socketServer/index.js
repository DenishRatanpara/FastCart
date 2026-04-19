import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_BASE_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {


  socket.on("identity", async (userId) => {
   socket.userId = userId;

  try {
    const res = await axios.post(
      `${process.env.NEXT_BASE_URL}/api/socket/connect`,
      {
        userId,
        socketId: socket.id,
      }
    );

    io.emit("user-status-changed", { userId, isOnline: true });
    console.log("Axios response:", res.data);
  } catch (error) {
    console.error("Axios failed:", error.message);
  }
  });

  socket.on("update-location", async ({ userId, latitude, longitude }) => {

  const location={
    type:"Point",
    coordinates:[longitude,latitude]
  }

  try {
    const res = await axios.post(
      `${process.env.NEXT_BASE_URL}/api/socket/update-location`,
      { userId, location}
    );

    io.emit("update-deliveryBoy-location",{userId,location})

    console.log("Axios response:", res.data);
  } catch (error) {
    console.error("Axios failed:", error.message);
  }
});


socket.on("join-room",(roomId)=>{
 
  socket.join(roomId)
})

socket.on("send-message",async(message)=>{
  console.log(message)
 
     await axios.post(`${process.env.NEXT_BASE_URL}/api/chat/save`,message)
     io.to(message.roomId).emit("send-message",message)
  
    

   
    
  

})

  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id);
    try {
      await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/disconnect`, {
        socketId: socket.id,
        userId: socket.userId
      });
      if (socket.userId) {
        io.emit("user-status-changed", { userId: socket.userId, isOnline: false });
      }
    } catch (error) {
      console.error("Disconnect axios failed:", error.message);
    }
  });
});

app.post('/notify',(req,res)=>{

  const {event,data,socketId}=req.body

  if(socketId){
    io.to(socketId).emit(event,data)
  }
  else{
    io.emit(event,data);
  }
  return res.status(200).json({success:true})

})

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
