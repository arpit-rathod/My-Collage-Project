import express from "express";
import DBConnection from "./DataBaseConnection.js";
import app from "./Routes.js";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

app.use(
  cors({
    // origin: "http://localhost:5173", // your frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // include Authorization here
  })
);
dotenv.config();
DBConnection();
const PORT = process.env.PORT || 5005;
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  //socket is a client
  console.log(`user connected: ${socket.id}`);
  socket.on("trubaId", (msg) => {
    console.log(`new msg from ${msg}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server runnig on PORT ${PORT}`);
});

export { io };
// app.use(cors({
//      origin: 'http://localhost:3000', // Allow only this frontend
//      methods: ['GET', 'POST'], // Allow specific HTTP methods
//      allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
//  }));
