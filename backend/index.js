// index.js (your backend entry point)
import express from "express";
import DBConnection from "./DataBaseConnection.js";
import appRouter from "./Routes.js"; // Renamed to avoid name conflict with express app
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Required for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); // 🛑 You were reusing `app` from Routes.js — bad idea!
const PORT = process.env.PORT || 5005;

// ====== CORS CONFIG ======
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

// ====== SECURITY HEADERS ======
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'"],
      connectSrc: ["'self'"],
    },
  })
);

app.use(express.json());

// ====== DATABASE CONNECTION ======
DBConnection();

// ====== API ROUTES ======
app.use("/api", appRouter); // Prefix all your routes like /api/submitAttendance

// ====== SERVE FRONTEND STATIC BUILD ======
const distPath = path.join(__dirname, "dist"); // Make sure this exists
app.use(express.static(distPath));

// For any route not handled (SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ====== SOCKET.IO SERVER ======
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on("trubaId", (msg) => {
    console.log(`New msg from ${msg}`);
  });
});

// ====== START SERVER ======
server.listen(PORT, () => {
  console.log(`✅ Server running on PORT ${PORT}`);
});

export { io };

// import express from "express";
// import DBConnection from "./DataBaseConnection.js";
// import app from "./Routes.js";
// import dotenv from "dotenv";
// import cors from "cors";
// import http from "http";
// import { Server } from "socket.io";
// import helmet from "helmet";
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config();
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://my-collage-project-frontend.onrender.com",
// ];
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
// DBConnection();
// const PORT = process.env.PORT || 5005;
// // app.use((req, res, next) => {
// //   res.setHeader(
// //     "Content-Security-Policy",
// //     "default-src 'self'; font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;"
// //   );
// //   next();
// // });

// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       fontSrc: ["'self'", "https://fonts.gstatic.com"],
//       styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
//       scriptSrc: ["'self'"],
//       imgSrc: ["'self'"],
//       connectSrc: ["'self'"],
//     },
//   })
// );
// app.use(express.json());
// // hwo create a route for all url end point in backend

// const distPath = path.join(__dirname, "dist"); // Ensure 'dist' is the correct build folder name

// app.use(express.static(distPath));

// // For all GET requests not handled above, send index.html (important for React Router)
// app.get("*", (req, res) => {
//   res.sendFile(path.join(distPath, "index.html"));
// });

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: allowedOrigins,
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// io.on("connection", (socket) => {
//   //socket is a client
//   console.log(`user connected: ${socket.id}`);
//   socket.on("trubaId", (msg) => {
//     console.log(`new msg from ${msg}`);
//   });
// });

// server.listen(PORT, () => {
//   console.log(`Server runnig on PORT ${PORT}`);
// });

// export { io };
// // app.use(cors({
// //      origin: 'http://localhost:3000', // Allow only this frontend
// //      methods: ['GET', 'POST'], // Allow specific HTTP methods
// //      allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
// //  }));
