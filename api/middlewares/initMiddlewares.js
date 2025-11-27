require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { join } = require("path");
const { connectToMongoDB } = require("../config/dbConfigure.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const pathCors = process.env.PATH_CORS 

const middleware = (app) => {
  // Allowed origins: production fixed domain + allow .vercel.app previews + localhost
  const allowedOrigins = [
    pathCors,
    "http://localhost:3000",
    "http://localhost:8080",
    "http://localhost:5173"
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // allow no-origin requests (curl, mobile apps)
        if (!origin) return callback(null, true);
        // exact allowed OR any vercel preview
        if (
          allowedOrigins.includes(origin) ||
          origin.endsWith(".vercel.app")
        ) {
          return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
    })
  );

  // Make sure credentials header is present
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
  });

  app.use(cookieParser());
  app.use(morgan("dev")); // logs to console (visible in Vercel logs)
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(join(__dirname, "../public")));
  console.log("Static folder:", join(__dirname, "../public"));
  app.use(express.json());
  connectToMongoDB();
};

module.exports = middleware;
