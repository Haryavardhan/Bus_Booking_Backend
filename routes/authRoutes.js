const express = require('express')
const { register, login, deleteUser, getUsers } = require('../controllers/authController')
const router = express.Router()

router.get('/', getUsers)
router.post('/register', register)
router.post('/login', login)
router.delete('/:id', deleteUser)

module.exports = router