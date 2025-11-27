const express = require("express");
const route = express.Router();
const { homeView, dashboardView, loginView, registerView } = require("../controllers/vistasControllers.js");
const { verifyToken } = require("../functions/verifyToken.js");

route.get("/", homeView); 
route.get("/login", loginView); 
route.get("/register", registerView); 
route.get("/dashboard", verifyToken, dashboardView); 

module.exports = route;