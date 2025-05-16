const express = require('express')
const cors = require('cors')
const dbConnect = require('./config/dbConnect')
const dotenv = require('dotenv')
const userRoutes = require('./routes/authRoutes')
const busRoutes = require('./routes/busRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const serverless = require('serverless-http')

dotenv.config()

const app = express()

app.use(cors({
  origin: ['http://localhost:5173','https://bus-booking-frontend-jade.vercel.app']
}));

app.use(express.json())
dbConnect()

app.use('/api/user', userRoutes)
app.use('/api/bus', busRoutes)
app.use('/api/booking', bookingRoutes)

module.exports = app
module.exports.handler = serverless(app)