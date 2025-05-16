const express = require('express')
const cors = require('cors')
const dbConnect = require('./config/dbConnect')
const dotenv = require('dotenv')
const userRoutes = require('./routes/authRoutes')
const busRoutes = require('./routes/busRoutes')
const bookingRoutes = require('./routes/bookingRoutes')

dotenv.config()

const app = express()

app.use(cors({
  origin: 'http://localhost:5173', 
}));

app.use(express.json())
dbConnect()

app.use('/api/user', userRoutes)
app.use('/api/bus', busRoutes)
app.use('/api/booking', bookingRoutes)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

