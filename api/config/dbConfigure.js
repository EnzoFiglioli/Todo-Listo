require("dotenv").config();
const mongoose = require("mongoose");

const url = process.env.URL;
console.log(url)
const db = process.env.DATABASE;

function connectToMongoDB(){
    mongoose.connect(url + db)
        .then(()=> console.log("La conexion a MongoDB es exitosa!"))
        .catch(()=> console.log("Error a conectarse a la base de datos"));
}

module.exports = {connectToMongoDB}