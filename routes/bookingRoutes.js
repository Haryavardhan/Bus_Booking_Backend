const express = require('express')
const {createBooking, getMyBookings, getBookedSeats} = require('../controllers/bookingController')
const {protect} = require('../middlewares/authMiddlewares')

const router = express.Router()

router.post('/', protect, createBooking)
router.get('/my-bookings', protect, getMyBookings )
router.get('/booked-seats/:busId', getBookedSeats)

module.exports = router