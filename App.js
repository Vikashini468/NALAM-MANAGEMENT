const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const { Pool } = require("pg");
const path = require("path");

dotenv.config();

const app = express();
const server = http.createServer(app);
const appointmentRoutes = require("./routes/appointmentRoutes");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const pharmacyRoutes = require("./routes/pharmacyRoutes");
app.use("/appointment", appointmentRoutes);

app.use("/", pharmacyRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(doctorRoutes);
app.use(patientRoutes);
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
app.use(patientRoutes);

server.listen(3000, () => {
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