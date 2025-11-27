require("dotenv").config();
const app = require("./api/main")
const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log("App iniciada en el puerto " + port)
    console.log(`http://localhost:${port}/`)
})