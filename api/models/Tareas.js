const mongoose = require("mongoose");

const tareaSchema = new mongoose.Schema({
    usuarioId: {type: mongoose.Schema.ObjectId, ref:'Usuario'},
    concepto: { type: String, required: true },
    estado: { type: Boolean, default: false},
    fecha: { type: Date, default: Date.now() },
    timestamp : { type: Date, default: Date.now() }
});

const Tarea = mongoose.model('Tarea', tareaSchema);

module.exports = {Tarea, tareaSchema}