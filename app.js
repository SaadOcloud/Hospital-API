const mongoose = require("mongoose");
const express = require("express");
const config = require("dotenv").config();


const patientRoutes = require('./routes/patientRoutes')
const appointmentRoutes = require('./routes/appointmentRoutes')


const PORT =process.env.PORT; 

const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl);

const app = express();

app.use(express.json());

app.use('/api/patients', patientRoutes)
app.use('/api/appointments', appointmentRoutes)


app.get("/", (req, res) => {
  res.send("App is running");
});

app.listen(PORT, () => console.log("Server running...."));
