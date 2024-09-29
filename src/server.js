require('dotenv').config(); 
const http=require('http');
const app = require('./app');
const connectDB = require('./config/db');

connectDB();

const PORT = process.env.PORT||3000;
const server = http.createServer(app);

server.listen(PORT,() =>{
    console.log(`Server Running On Port ${PORT}`)
});