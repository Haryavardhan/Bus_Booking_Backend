const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    busId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
        required: true
    },
    seatsBooked: {
        type: [Number], // Array of seat numbers
        required: true
    },
    journeyDate: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    bookingTime: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Booking', bookingSchema);