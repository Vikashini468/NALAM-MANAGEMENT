const express = require("express");
const http = require("http");
require("dotenv").config();

const twilio = require("twilio");

const client = twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_TOKEN
);

const { Server } = require("socket.io");
const { Pool } = require("pg");

const authRoutes = require("./routes/authRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.locals.client = client;
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.use(express.static(__dirname));
app.use("/uploads", express.static("uploads"));

const pool = new Pool({
    user:"postgres",
    host:"localhost",
    database:"nalamaihospital",
    password:"vikashini",
    port:5432
});
app.locals.pool = pool;

app.use(authRoutes);

server.listen(3000,()=>{
    console.log("Server Running");
});
app.use(authRoutes);
app.get("/otp.html",(req,res)=>{

   res.sendFile(
      path.join(
         __dirname,
         "views",
         "auth",
         "otp.html"
      )
   );

});