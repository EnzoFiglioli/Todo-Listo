require("dotenv").config();
const express = require("express");
const app = express();
const middleware = require("./middlewares/initMiddlewares.js");

const viewsRoutes = require("./routes/viewsRoutes.js");
const userRoutes = require("./routes/usersRoutes.js");
const tareasRoutes = require("./routes/tareasRoutes.js");

const { verifyToken } = require("./functions/verifyToken.js");

// Middlewares (CORS, cookieParser, json, logging, db connect)
middleware(app);

// Routes
app.use("/", viewsRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/tareas", verifyToken, tareasRoutes);

// Error handler (fallback)
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  if (!res.headersSent) {
    res.status(500).json({ msg: "Server error", error: err.message || err });
  }
});

// Export app so Vercel can handle requests
module.exports = app;
