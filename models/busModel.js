const mongoose = require('mongoose')

const busSchema =  new mongoose.Schema({
    name: {type: String, required: true},
    number: { type: String, required: true, unique: true },
    seats: {type: Number, required: true},
    departureTime: {type: String, required: true},
    arrivalTime: {type: String, required: true},
    from: {type: String, required: true},
    to: {type: String, required: true},
    price: {
        type: Number,
        required: true
    },
}, {timestamps: true})

const Bus = mongoose.model('Bus', busSchema)

module.exports = Bus