const express = require('express');
const route = express.Router();
const { login, signIn, logout, deleteAccount } = require("../controllers/usuariosController.js");
const { verifyToken } = require("../functions/verifyToken.js");

route.post("/login", login);
route.post("/crear", signIn);
route.get("/logout", logout);
route.delete("/delete", verifyToken, deleteAccount);

module.exports = route;
