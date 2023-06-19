import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
//import connectDB from "./config/db.js";

//Configure env
dotenv.config();

//database config
//connectDB();

//rest object is created 
const app = express()

//middlewares 
//app.use(express.json())
//app.use(morgan('dev'))

//rest API
app.get('/', (req,res) => {
    res.send("<h1>Welcome To our SmartShop website</h1>");
});

//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
    console.log(`Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgGreen.white);
});