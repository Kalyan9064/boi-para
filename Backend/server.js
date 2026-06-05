require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");

const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/book");
const bookRequestRoutes = require("./routes/bookRequest");
const reviewRoutes = require("./routes/review");
const conversationRoutes = require("./routes/conversation");
const messageRoutes = require("./routes/message");

const app = express();

/*SECURE CORS CONFIG*/

const allowedOrigins = [
  "http://localhost:5173",        // local frontend
  "https://boi-para.vercel.app"   // deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

/* =========================
   MIDDLEWARE
   ========================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   SOCKET.IO SETUP
   ========================= */

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

app.set("io", io);

// Socket.IO Connection Middleware (Authentication using JWT)
io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid token"));
  }
});

// Map to track online users: userId string -> Set of socketId strings
const onlineUsers = new Map();

io.on("connection", (socket) => {
  const userIdStr = socket.userId.toString();

  // Join a personal room based on userId
  socket.join(userIdStr);

  if (!onlineUsers.has(userIdStr)) {
    onlineUsers.set(userIdStr, new Set());
  }
  onlineUsers.get(userIdStr).add(socket.id);

  // Broadcast list of online users
  io.emit("onlineUsers", Array.from(onlineUsers.keys()));

  // Join conversation channel
  socket.on("joinConversation", (conversationId) => {
    socket.join(`conversation_${conversationId}`);
  });

  // Leave conversation channel
  socket.on("leaveConversation", (conversationId) => {
    socket.leave(`conversation_${conversationId}`);
  });

  // Relay typing indicators
  socket.on("typing", ({ conversationId, isTyping }) => {
    socket.to(`conversation_${conversationId}`).emit("typingStatus", {
      conversationId,
      userId: socket.userId,
      isTyping
    });
  });

  socket.on("disconnect", () => {
    const userSockets = onlineUsers.get(userIdStr);
    if (userSockets) {
      userSockets.delete(socket.id);
      if (userSockets.size === 0) {
        onlineUsers.delete(userIdStr);
      }
    }
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });
});

/* =========================
   ROUTES
   ========================= */

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/requests", bookRequestRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

/* =========================
   STATIC FILES
   ========================= */

app.use("/uploads", express.static("uploads"));

/* =========================
   ERROR HANDLING
   ========================= */

const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

/* =========================
   TEST ROUTE
   ========================= */

app.get("/", (req, res) => {
  res.send("BoiPara API running 🚀");
});

/* =========================
   DATABASE & SERVER START
   ========================= */

if (process.env.NODE_ENV !== "test") {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected ✅"))
    .catch(err => console.error("MongoDB error:", err.message));

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;