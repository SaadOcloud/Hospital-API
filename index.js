const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const express = require('express')
const dotenv = require("dotenv").config()
const { notFound, errorHandler, FeeMiddleware } = require("./middleware/errorMiddleware")
const connectDB = require("./config/db")

const patientRoutes = require('./routes/patientRoutes')
const appointmentRoutes = require('./routes/appointmentRoutes')

connectDB()

const app = express()

app.use(express.json())

app.use('/api/patients', patientRoutes)
app.use('/api/appointments', appointmentRoutes)

app.use(notFound)
app.use(errorHandler)


app.get('/', (req, res) => {
    res.send('App is running...')
})


const port = process.env.PORT
app.listen(port, () => console.log(`Server running......`))