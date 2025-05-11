import express from "express";
import DBConnection from "./DataBaseConnection.js";
import app from "./Routes.js";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

dotenv.config();
const allowedOrigins = [
  "http://localhost:5173",
  "https://my-collage-project-frontend.onrender.com",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
DBConnection();
const PORT = process.env.PORT || 5005;
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
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
