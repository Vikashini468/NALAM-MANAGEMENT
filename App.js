const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const { Pool } = require("pg");
const path = require("path");

dotenv.config();

const app = express();
const server = http.createServer(app);

/* ===========================
   BODY PARSER
=========================== */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===========================
   DATABASE
=========================== */

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "nalamaihospital",
    password: "vikashini",
    port: 5432
});

app.locals.pool = pool;

/* ===========================
   ROUTES
=========================== */

const appointmentRoutes = require("./routes/appointmentRoutes");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const pharmacyRoutes = require("./routes/pharmacyRoutes");
const labRoutes = require("./routes/labRoutes");

app.use("/appointment", appointmentRoutes);
app.use("/", pharmacyRoutes);
app.use("/", authRoutes);
app.use("/", patientRoutes);
app.use("/", doctorRoutes);

/* Lab Routes */

app.use("/lab", labRoutes);

/* ===========================
   STATIC FILES
=========================== */
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "views")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/otp.html", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "views",
            "auth",
            "otp.html"
        )
    );
});

/* ===========================
   SERVER
=========================== */

server.listen(3001, () => {
    console.log("Server Running on Port 3001");
});