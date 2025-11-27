const express = require("express");
const route = express.Router();
const { tareasLista, crearTarea, eliminarTarea, actualizarTarea } = require("../controllers/tareasControllers.js");

route.get("/", tareasLista);
route.post("/crear", crearTarea);
route.delete("/eliminar/:id", eliminarTarea);
route.patch("/actualizar/:id", actualizarTarea);

module.exports = route;