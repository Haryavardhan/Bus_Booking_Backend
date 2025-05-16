const Bus = require('../models/busModel')
const Booking = require('../models/bookingModel')
const asyncHandler = require('express-async-handler')


//search buses
const searchBuses = async (req, res) => {
  try {
    const { from, to, date } = req.body;

    if (!from || !to || !date) {
      return res.status(400).json({ error: "Please provide from, to, and date" });
    }

    const searchDate = new Date(date);

    // Find buses matching from and to
    const buses = await Bus.find({
      from: from.toLowerCase(),
      to: to.toLowerCase(),
    });

    // Add seatsLeft info to each bus
    const busesWithSeatsLeft = await Promise.all(
      buses.map(async (bus) => {
        const bookings = await Booking.find({
          busId: bus._id,
          journeyDate: searchDate,
        });

        const bookedSeats = bookings.reduce((acc, booking) => acc + booking.seatsBooked.length, 0);
        const seatsLeft = bus.seats - bookedSeats;

        return {
          ...bus._doc,
          seatsLeft,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: busesWithSeatsLeft.length,
      buses: busesWithSeatsLeft,
    });

  } catch (error) {
    console.error('Error searching buses:', error);
    res.status(500).json({ error: 'Server error while searching for buses' });
  }
};

//get all buses
const getBuses = asyncHandler(async (req, res) => {
    const buses = await Bus.find({});
    res.status(200).json({ success: true, count: buses.length, buses })
})

const getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    res.json({ bus });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

//add bus(admin)
const addBus = asyncHandler(async (req, res) => {
    const { name, number, seats, departureTime, arrivalTime, from, to, price } = req.body

    if (!name || !number || !seats || !departureTime || !arrivalTime || !from || !to || !price) {
        res.status(400)
        throw new Error('All fields are required')
    }

    const exists = await Bus.findOne({number})
    if(exists)
    {
        res.status(400)
        throw new Error('Bus number already exists')
    }

    const bus = await Bus.create({
        name,
        number,
        seats,
        departureTime,
        arrivalTime,
        from: from.toLowerCase(),
        to: to.toLowerCase(),
        price,
    });

    res.status(201).json({ success: true, message: 'Bus added', bus })

})

//delete bus
const deleteBus = asyncHandler(async (req, res) => {
    const bus = await Bus.findById(req.params.id)
    if (!bus) {
        res.status(404);
        throw new Error('Bus not found')
    }
    await bus.deleteOne()
    res.status(200).json({ success: true, message: 'Bus deleted' })
})

// update bus
const updateBus = asyncHandler(async (req, res) => {
    const bus = await Bus.findById(req.params.id)
    if (!bus) {
        res.status(404)
        throw new Error('Bus not found')
    }

    const updates = req.body
    if (updates.from) updates.from = updates.from.toLowerCase()
    if (updates.to) updates.to = updates.to.toLowerCase()

    const updatedBus = await Bus.findByIdAndUpdate(req.params.id, updates, { new: true })

    res.status(200).json({ success: true, message: 'Bus updated', bus: updatedBus })
});

module.exports = {searchBuses, getBuses, addBus, deleteBus, updateBus, getBusById}