const express = require('express');
const { searchBuses, getBuses, addBus, deleteBus, updateBus, getBusById } = require('../controllers/busController');
const router = express.Router();

const { protect, isAdmin } = require('../middlewares/authMiddlewares');


router.get('/', getBuses);                // This works for fetching buses
router.get('/:id', protect, getBusById)
router.post('/search-buses', protect, searchBuses);  // Protect the search route
router.post('/', protect, isAdmin, addBus);  // Only admin can add bus
router.delete('/:id', protect, isAdmin, deleteBus);  // Only admin can delete bus
router.put('/:id', protect, isAdmin, updateBus);  // Only admin can update bus



module.exports = router;
