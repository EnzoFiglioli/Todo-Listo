const mongoose = require("mongoose");
const {tareaSchema} = require("./Tareas.js");

const usuarioSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nombreCompleto: { type: String, required: true },
    email: { type: String, required: true, default: 'todolisto@mail.com'},
    timestamp: { type: Date, default: Date.now }
});

usuarioSchema.pre("findOneAndDelete", async function(next){
    const user = await this.model.findOne(this.getFilter());
    if(!user) return next();
    
    await mongoose.model("Tarea").deleteMany({usuarioId: user._id});
    next()
})

const Usuario = mongoose.model('Usuario',usuarioSchema);

module.exports = {Usuario}