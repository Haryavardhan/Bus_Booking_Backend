const asyncHandler = require('express-async-handler')
const Booking = require('../models/bookingModel')
const Bus = require('../models/busModel')

//Seat booking
const createBooking = async (req, res) => {
    const {busId, seatsBooked, journeyDate } = req.body
    const userId = req.user._id

    if(!busId || !seatsBooked || !Array.isArray(seatsBooked) || !seatsBooked.length===0 || !journeyDate )
    {
        res.status(400).json({error: 'Please provide valid busId and seatsBooked'})
    }

    const bus = await Bus.findById(busId)
    if(!bus)
    {
        res.status(400).json({error: 'Bus not found'})
    }

    const existingBookings = await Booking.find({busId, journeyDate})
    const bookedSeats = existingBookings.flatMap(b => b.seatsBooked)

    // Check for already booked seats
    const duplicateSeats = seatsBooked.filter(seat => bookedSeats.includes(seat))
    if (duplicateSeats.length > 0) {
        res.status(400).json({error: `Seats already booked: ${duplicateSeats.join(', ')}`})
    }

    const totalPrice = bus.price * seatsBooked.length

    const booking = await Booking.create({
        userId,
        busId,
        seatsBooked,
        totalPrice,
        journeyDate
    })

    res.status(201).json({
        success: true,
        message: 'Bokking Successful',
        booking
    })
}

//get my bookings
const getMyBookings = asyncHandler(async(req, res) => {
    const bookings = await Booking.find({ userId: req.user._id })
        .populate('busId')
        .sort({ bookingTime: -1 })

    res.status(200).json({ success: true, bookings })
})

const getBookedSeats = async (req, res) => {
  try {
    const { busId } = req.params; // Get busId from route params
    const { date } = req.query; // Get journey date from query params

    // Parse the date string to Date object
    const journeyDate = new Date(date);

    // Fetch bookings for the bus on the specified date
    const bookings = await Booking.find({
      busId,
      journeyDate: {
        $gte: new Date(journeyDate.setHours(0, 0, 0, 0)),
        $lt: new Date(journeyDate.setHours(23, 59, 59, 999)),
      },
    });

    // Extract booked seats from the bookings
    const bookedSeats = bookings.flatMap(booking => booking.seatsBooked);

    // Send booked seats as response
    res.json({ bookedSeats });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {createBooking, getMyBookings, getBookedSeats}

